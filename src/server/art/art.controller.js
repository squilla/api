const AWS = require('aws-sdk');
const multer = require('multer');
const expressAsyncHandler = require('express-async-handler');
const ArtModel = require('./art.model');

const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Matches bucket, region, and key
const s3RegExp = /https:\/\/(.*?)\.s3.(.*?)\.amazonaws\.com\/(.*)/;

const uploadArt = upload.single('art');

module.exports = {
  // Show all Art
  Index: [
    expressAsyncHandler(async (req, res) => {
      res.json(await ArtModel.find());
    }),
  ],

  // Post new Art
  Create: [
    uploadArt,
    expressAsyncHandler(async (req, res) => {
      // TODO: Use Promise.all() by generating data.Location
      const data = await s3.upload({
        ACL: 'public-read',
        Body: req.file.buffer,
        Bucket: 'squilla',
        Key: `art/${Date.now()}`,
      }).promise();

      const art = await ArtModel.create({ ...req.body, url: data.Location });

      res.json(art);
    }),
  ],

  // Display one Art
  Get: [
    expressAsyncHandler(async (req, res) => {
      res.json(await ArtModel.findById(req.params.id));
    }),
  ],

  GetRandom: [
    expressAsyncHandler(async (req, res) => {
      const count = await ArtModel.countDocuments();
      const Art = await ArtModel.findOne().skip(Math.floor(Math.random() * count));
      res.json(Art);
    }),
  ],

  // Update one Art
  Update: [
    uploadArt,
    expressAsyncHandler(async (req, res) => {
      const art = await ArtModel.findById(req.params.id);

      const queued = [];

      if (req.file) {
        const matches = s3RegExp.exec(art.url);
        console.log(matches);
        const [, bucket, , key] = matches;

        queued.push(
          s3.upload({
            ACL: 'public-read',
            Bucket: bucket,
            Body: req.file.buffer,
            Key: key,
          }).promise(),
        );
      }

      if (req.body) {
        const { name, description } = req.body;

        if (name) {
          art.name = name;
        }

        if (description) {
          art.description = description;
        }
      }

      if (art.isModified()) {
        queued.push(art.save());
      }

      await Promise.all(queued);

      res.json(art);
    }),
  ],

  // Delete one Art
  Delete: [
    expressAsyncHandler(async (req, res) => {
      const art = await ArtModel.findById(req.params.id);

      const [, bucket, , key] = s3RegExp.exec(art.url);

      await Promise.all([
        s3.deleteObject({
          Bucket: bucket,
          Key: key,
        }).promise(),
        art.remove(),
      ]);

      res.json(art);
    }),
  ],
};

const AWS = require('aws-sdk');
const multer = require('multer');
const asyncHandler = require('express-async-handler');
const pick = require('lodash.pick');
const ArtModel = require('./art.model');
const checkAuth = require('../../middleware/checkAuth');

const s3 = new AWS.S3();

const upload = multer({
  storage: multer.memoryStorage(),
});

// Matches bucket, region, and key
const s3RegExp = /https:\/\/(.*?)\.s3.(.*?)\.amazonaws\.com\/(.*)/;

const uploadArt = upload.single('art');

const checkIsArtist = (req, res, next) => {
  if (req.isArtist) {
    next();
  } else {
    res.status(403).send('User is not an artist');
  }
};

const findDoc = asyncHandler(async (req, res, next) => {
  req.art = await ArtModel.findById(req.params.id);

  if (req.art) {
    next();
  } else {
    res.status(400).send('Art does not exist');
  }
});

const checkOwnership = (req, res, next) => {
  if (req.user._id.equals(req.art.artist)) {
    next();
  } else {
    res.status(403).send('Artist does not own this art');
  }
};

module.exports = {
  // Show all Art
  Index: [
    asyncHandler(async (req, res) => {
      res.json(await ArtModel.find());
    }),
  ],

  // Send random
  GetRandom: [
    asyncHandler(async (req, res) => {
      const count = await ArtModel.countDocuments();
      const Art = await ArtModel.findOne().skip(Math.floor(Math.random() * count));
      res.json(Art);
    }),
  ],

  // Send one Art
  Get: [
    findDoc,
    asyncHandler(async (req, res) => {
      res.json(req.art);
    }),
  ],

  // Post new Art
  Create: [
    checkAuth,
    checkIsArtist,
    uploadArt,
    asyncHandler(async (req, res) => {
      // TODO: Use Promise.all() by generating data.Location
      const data = await s3.upload({
        ACL: 'public-read',
        Body: req.file.buffer,
        Bucket: 'squilla',
        Key: `art/${Date.now()}`,
      }).promise();

      const art = await ArtModel.create({
        ...req.body,
        url: data.Location,
        artist: req.user._id,
      });

      res.json(art);
    }),
  ],

  // Update one Art
  Update: [
    checkAuth,
    checkIsArtist,
    findDoc,
    checkOwnership,
    uploadArt,
    asyncHandler(async (req, res) => {
      const { art } = req;

      const queued = [];

      if (req.file) {
        const matches = s3RegExp.exec(art.url);
        const [, Bucket, , Key] = matches;

        queued.push(
          s3.upload({
            ACL: 'public-read',
            Bucket,
            Body: req.file.buffer,
            Key,
          }).promise(),
        );
      }

      art.set(pick(req.body, ['name', 'description']));

      if (art.isModified()) {
        queued.push(art.save());
      }

      await Promise.all(queued);

      res.json(art);
    }),
  ],

  // Delete one Art
  Delete: [
    checkAuth,
    checkIsArtist,
    findDoc,
    checkOwnership,
    asyncHandler(async (req, res) => {
      const { art } = req;

      const [, Bucket, , Key] = s3RegExp.exec(art.url);

      await Promise.all([
        s3.deleteObject({
          Bucket,
          Key,
        }).promise(),
        art.remove(),
      ]);

      res.json(art);
    }),
  ],
};

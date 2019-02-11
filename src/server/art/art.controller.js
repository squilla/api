const S3 = require('aws-sdk/clients/s3');
const multer = require('multer');
const expressAsyncHandler = require('express-async-handler');
const multerS3 = require('multer-s3');
const ArtModel = require('./art.model');

const s3 = new S3();

const upload = multer({
  storage: multerS3({
    s3,
    bucket: 'squilla',
    acl: 'public-read',
  }),
});

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
      res.json(await ArtModel.create({ url: req.file.location }));
    }),
  ],

  // Display one Art
  Get: [
    expressAsyncHandler(async (req, res) => {
      res.json(await ArtModel.findById(req.params.id));
    }),
  ],

  // Update one Art
  Update: [
    expressAsyncHandler(async (req, res) => {
      res.json(await ArtModel.findByIdAndUpdate(req.params.id, req.body));
    }),
  ],

  // Delete one Art
  Delete: [
    expressAsyncHandler(async (req, res) => {
      res.json(await ArtModel.findByIdAndDelete(req.params.id));
    }),
  ],
};

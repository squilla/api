const ArtModel = require('./art.model');

module.exports = {
  // Show all Art
  async Index(req, res) {
    res.json(await ArtModel.find());
  },

  // Post new Art
  async Create(req, res) {
    res.json(await ArtModel.create(req.body));
  },

  // Display one Art
  async Get(req, res) {
    res.json(await ArtModel.findById(req.params.id));
  },

  // Update one Art
  async Update(req, res) {
    res.json(await ArtModel.findByIdAndUpdate(req.params.id, req.body));
  },

  // Delete one Art
  async Delete(req, res) {
    res.json(await ArtModel.findByIdAndDelete(req.params.id));
  },
};

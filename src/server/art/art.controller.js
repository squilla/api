const ArtModel = require('./art.model');

module.exports = {
  async Index(req, res) {
    res.send(await ArtModel.find());
  },

  async Create(req, res) {
    res.send(await ArtModel.create(req.body));
  },

  async Get(req, res) {
    res.send(await ArtModel.findById(req.params.id));
  },

  async Update(req, res) {
    res.send(await ArtModel.findByIdAndUpdate(req.params.id, req.body));
  },

  async Delete(req, res) {
    res.send(await ArtModel.findByIdAndDelete(req.params.id));
  },
};

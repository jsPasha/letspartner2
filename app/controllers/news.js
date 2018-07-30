const mongoose = require("mongoose");
const News = mongoose.model("news");

const { deleteAll } = require("../helpers/files");

const newsController = {
  create: (req, res) => {
    new News(req.body).save(err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  update: (req, res, next) => {
    News.update({ _id: req.params.id }, { $set: req.body }, err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/admin/news/`);
    });
  },
  delete: async (req, res) => {
    await deleteAll({ req, Model: News });
    News.deleteOne({ _id: req.params.id }, err => {
      if (err) return res.status(400).send({ err });
      res.redirect(`/${req.locale}/admin/news/`);
    });    
  }
};

module.exports = newsController;

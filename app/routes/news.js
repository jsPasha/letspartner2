const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const settings = require("../../data/settings.js");

const News = mongoose.model("news");
const Page = mongoose.model("pages");

const { generateList } = require("../helpers/list");

module.exports = templatePath => {

  router.get("/news", (req, res) => {
    generateListPage(req, res, templatePath);
  });

  router.get("/news/:page", (req, res) => {
    generateListPage(req, res, templatePath);
  });

  router.get("/news/page/:createdAt/:alias", (req, res, next) => {
    const { createdAt, alias } = req.params;
    News.findOne({ createdAt, alias }, function(err, news) {
      if (err) return res.status(400).send("error");
      if (!news) return res.status(404).send("not found");
      res.render(templatePath, {
        content: "../modules/news/view",
        news
      });
    });
  });

  return router;
};

const generateListPage = (req, res, templatePath) => {
  const perPage = settings.news.pageList;
  const page = req.params.page || 1;
  const { locale } = req;
  return generateList({
    model: News,
    page,
    perPage,
    locale,
    published: true
  })
    .then(({ objects, count }) => {
      Page.findOne({ type: "news" }).exec((err, pageHead) => {
        res.render(templatePath, {
          pageHead,
          news: objects,
          content: "../modules/news/index",
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    })
    .catch(err => res.send("error: /news" + err));
};

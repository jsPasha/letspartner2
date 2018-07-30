const mongoose = require("mongoose");
const Company = mongoose.model("company");
const Page = mongoose.model("pages");
const List = mongoose.model("lists");
const News = mongoose.model("news");

const moment = require('moment');

const { templatePath, company } = require("../../data/settings");

const Site = {
  main: {
    view: function(req, res) {
      Page.findOne({ type: `main` }).exec((err, pageHead) => {
        res.render(templatePath, {
          pageHead,
          content: "../modules/index"
        });
      });
    },
    getNews: function(req, res) {
      let { locale } = req;
      News.find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .exec((err, news) => {
          news.forEach((el, i) => {
            news[i].moment = moment(news[i].createdAd).format('LLL');
          })
          res.send({ news, locale });
        });
    }
  },
  companies: {
    list: (req, res) => {
      const { type } = req.params;
      const perPage = 10;
      const page = req.params.page || 1;

      if (type !== "startup" && type !== "corporation")
        return res.send("Error 404");

      Company.find({ type, status: "published" })
        .sort({ submitedAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, companies) {
          Company.count({ type, status: "published" }, (err, count) => {
            Page.findOne({ type: `${type}s` }).exec((err, pageHead) => {
              List.find({}, (err, lists) => {
                res.render(templatePath, {
                  pageHead,
                  companies,
                  lists,
                  type,
                  content: `../modules/companies/${type}/index`,
                  current: page,
                  pages: Math.ceil(count / perPage)
                });
              });
            });
          });
        });
    },
    view: (req, res) => {
      const { type } = req.params;
      Company.findOne(req.params, (err, company) => {
        if (!company) return res.send("No company");
        List.find({}, (err, lists) => {
          res.render(templatePath, {
            lists,
            content: `../modules/companies/${type}/view`,
            company
          });
        });
      });
    }
  }
};

module.exports = Site;

const { isLoggedIn, isAdmin } = require("../helpers/routes");
const Languages = require("../controllers/languages");
const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Tags = mongoose.model("tags");

const Site = require("../controllers/site");

router.get("/languages", [isLoggedIn, isAdmin], Languages.list);

router.post("/languages", [isLoggedIn, isAdmin], Languages.save);

router.get("/tags", isLoggedIn, (req, res, next) => {
  Tags.find({ name: { $regex: req.query.q } }, (err, items) => {
    res.send(items);
  });
});

router.get("/main-news", Site.main.getNews);

module.exports = router;

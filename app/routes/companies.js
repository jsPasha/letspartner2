const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

const Site = require("../controllers/site");

router.get("/companies/:type", Site.companies.list);

router.get("/companies/:type/:page", Site.companies.list);

router.get("/companies/:type/:createdAt/:alias", Site.companies.view);

module.exports = router;

const { isLoggedIn, isBlocked } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const { setInfoPopup } = require("../helpers/popups");

const profileController = require("../controllers/profile");
const companyController = require("../controllers/company");

module.exports = templatePath => {

  router.get("/activation-user", isLoggedIn, (req, res) => {
    res.render(templatePath, {
      content: "../modules/profile/activation"
    });
  });

  router.get(
    "/profile",
    isLoggedIn,
    setInfoPopup,
    isBlocked,
    profileController.view
  );

  router.get(
    "/profile/company/:type/create",
    isLoggedIn,
    companyController.createView
  );

  router.get(
    "/profile/company/:type/update/:_id",
    isLoggedIn,
    companyController.updateView
  );

  router.get(
    "/profile/company/:type/update/:companyId/member/:memberId",
    isLoggedIn,
    companyController.updateMember.get
  );

  router.get(
    "/profile/companies",
    isLoggedIn,
    companyController.profileListView
  );

  router.get(
    "/profile/companies/:page",
    isLoggedIn,
    companyController.profileListView
  );

  return router;
};

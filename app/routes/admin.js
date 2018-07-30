const { isLoggedIn, isAdmin } = require("../helpers/routes");
const express = require("express");
const router = express.Router();

const Admin = require("../controllers/admin");

router.get("/admin", [isLoggedIn, isAdmin], Admin.view);

router.get("/admin/news/create", [isLoggedIn, isAdmin], Admin.news.create);

router.get("/admin/news/update/:id", [isLoggedIn, isAdmin], Admin.news.update);

router.get("/admin/news", [isLoggedIn, isAdmin], Admin.news.list);

router.get("/admin/users", [isLoggedIn, isAdmin], Admin.users.list);

router.get("/admin/companies", [isLoggedIn, isAdmin], Admin.companies.list);

router.get("/admin/popups", [isLoggedIn, isAdmin], Admin.popups.list);

router.get("/admin/lists/:type", [isLoggedIn, isAdmin], Admin.lists.view);

router.get("/admin/news/:page", [isLoggedIn, isAdmin], Admin.news.list);

router.get("/admin/users/:page", [isLoggedIn, isAdmin], Admin.users.list);

router.get("/admin/companies/:page", [isLoggedIn, isAdmin], Admin.companies.list);

router.get("/admin/users/update/:id", [isLoggedIn, isAdmin], Admin.users.update);

router.get("/admin/popups/update/:id", [isLoggedIn, isAdmin], Admin.popups.update);

router.get("/admin/company/:type/update/:id", [isLoggedIn, isAdmin], Admin.companies.update);

router.get("/admin/company/:type/update/:id", [isLoggedIn, isAdmin], Admin.companies.update);

router.get("/admin/page-settings/:type", [isLoggedIn, isAdmin], Admin.pages.settings);

router.get("/admin/languages", [isLoggedIn, isAdmin], Admin.languages.view);

module.exports = router;

const { isLoggedIn } = require("./helpers/routes");
const express = require("express");
const router = express.Router();
const { setLocale } = require("./helpers/locale");
const locales = require("../data/locales");
const { userActivation } = require("./helpers/activation");

const { templatePath } = require("../data/settings");

const Site = require("../app/controllers/site");

module.exports = function(app, passport) {
  router.get("/", Site.main.view);

  let authRouter = require("./routes/auth")(templatePath);
  let profileRouter = require("./routes/profile")(templatePath);
  let actionRoutes = require("./routes/action")(passport);
  let adminRoutes = require("./routes/admin");
  let newsRoutes = require("./routes/news")(templatePath);
  let companiesRoutes = require("./routes/companies");
  let apiRoutes = require("./routes/api");

  app.use("/", setLocale);

  app.use("/action", actionRoutes);

  app.use("/api", apiRoutes);

  locales.forEach(lang => {
    app.use(`/${lang}`, setLocale, [
      router,
      authRouter,
      userActivation,
      profileRouter,
      adminRoutes,
      newsRoutes,
      companiesRoutes
    ]);
  });
};

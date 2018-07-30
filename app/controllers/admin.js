const { templatePath } = require("../../data/settings");
const Languages = require("./languages");

const mongoose = require("mongoose");
const News = mongoose.model("news");
const Page = mongoose.model("pages");
const Popup = mongoose.model("popups");
const Users = mongoose.model("users");
const Company = mongoose.model("company");
const Lists = mongoose.model("lists");

const settings = require("../../data/settings.js");

const { generateList } = require("../helpers/list");
const userList = require("../../public/js/templates/users");
const companiesList = require("../../public/js/templates/companies");

const Team = require("../helpers/members");

const timezoneJson = require("timezones.json");

const Admin = {
  view: (req, res) => {
    res.render(templatePath, {
      content: "../modules/admin/index"
    });
  },

  news: {
    create: (req, res) => {
      res.render(templatePath, {
        content: "../modules/admin/modules/news/form",
        action: "create"
      });
    },

    update: (req, res) => {
      const id = req.params.id;

      News.findById(id, (err, newsItem) => {
        if (err) return res.send(err);
        res.render(templatePath, {
          content: "../modules/admin/modules/news/form",
          action: "update",
          newsItem
        });
      });
    },

    list: (req, res) => {
      generateNewsPage(req, res, templatePath);
    }
  },

  users: {
    update: (req, res) => {
      const id = req.params.id;

      Users.findById(id, (err, userProfile) => {
        if (err) return res.send(err);

        Company.find({ creator: id }, (err, companies) => {
          if (err) return res.send(err);

          res.render(templatePath, {
            companies,
            userProfile,
            content: "../modules/admin/modules/users/form",
            timezoneJson,
            message: req.flash("profileMessage")[0]
          });
        });
      });
    },

    list: (req, res) => {
      generateUsersPage(req, res, templatePath);
    }
  },

  companies: {
    update: (req, res) => {
      const { type, id } = req.params;
      Company.findById(id, (err, company) => {
        Lists.find((err, lists) => {
          res.render(templatePath, {
            content: `../modules/profile/modules/company/${type}/index`,
            action: "update",
            obj: company,
            admin: true,
            lists,
            type,
            teamList: Team.profileList,
            message: req.flash("companyMessage")
          });
        });
      });
    },

    list: (req, res) => {
      const { page } = req.params;
      generateCompaniesPage(req, res, templatePath);
    }
  },

  popups: {
    update: (req, res) => {
      const id = req.params.id;

      Popup.findById(id, (err, popup) => {
        if (err) return res.send(err);
        res.render(templatePath, {
          content: "../modules/admin/modules/popups/form",
          popup: popup.content,
          id: popup.id
        });
      });
    },

    list: (req, res) => {
      Popup.find().exec((err, popups) => {
        res.render(templatePath, {
          popups,
          content: `../modules/admin/modules/popups/index`
        });
      });
    }
  },

  pages: {
    settings: (req, res) => {
      const { type } = req.params;
      Page.findOne({ type }).exec(async (err, page) => {
        if (!page) page = await Admin.pages.create(type);
        res.render(templatePath, {
          page: page.content,
          type,
          content: `../modules/admin/modules/sections/settings`
        });
      });
    },
    create: type => {
      return new Promise((res, rej) => {
        let page = new Page({ type });
        page.save((err, el) => {
          if (err) return rej(err);
          res(el);
        });
      });
    }
  },

  languages: {
    view: Languages.view
  },

  lists: {
    view: (req, res) => {
      const { type } = req.params;
      Lists.find({ type }, (err, list) => {
        res.render(templatePath, {
          list,
          type,
          content: `../modules/admin/modules/lists/index`
        });
      });
    },
    add: (req, res) => {
      new Lists(req.body).save((err, item) => {
        res.send({
          type: "success",
          text: "Ok",
          locale: req.locale,
          item
        });
      });
    },
    remove: (req, res) => {
      const { id } = req.params;
      Lists.findByIdAndRemove(id, err => {
        res.send({
          type: "success",
          text: "Removed"
        });
      });
    }
  }
};

const generateNewsPage = (req, res, templatePath) => {
  const perPage = settings.news.adminList;
  const page = req.params.page || 1;
  const { locale } = req;
 
  generateList({
    model: News,
    page,
    perPage,
    locale
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        news: objects,
        content: "../modules/admin/modules/news/index",
        current: page,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(err => res.send("error: /admin/news/:page" + err));
};

const generateUsersPage = (req, res, templatePath) => {
  const perPage = settings.news.adminList;
  const page = req.params.page || 1;
  const { locale } = req;
  generateList({
    model: Users,
    page,
    perPage,
    locale
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        users: objects,
        content: "../modules/admin/modules/users/index",
        current: page,
        pages: Math.ceil(count / perPage),
        userList
      });
    })
    .catch(err => res.send("error: /admin/users/:page" + err));
};

const generateCompaniesPage = (req, res, templatePath) => {
  const perPage = settings.company.adminList;
  const page = req.params.page || 1;
  const { locale, query } = req;
  generateList({
    model: Company,
    page,
    perPage,
    locale,
    query
  })
    .then(async ({ objects, count }) => {
      let users = {};

      if (objects)
        for (let i = 0; i < objects.length; i++) {
          var { creator } = objects[i];
          if (!users[creator]) {
            users[creator] = await getUser(creator);
          }
          objects[i].creator = JSON.stringify(users[creator]);
        }

      res.render(templatePath, {
        query,
        objects,
        content: "../modules/admin/modules/company/index",
        current: page,
        pages: Math.ceil(count / perPage),
        companiesList
      });
    })
    .catch(err => res.send("error: /admin/company/:page" + err));
};

const getUser = id => {
  return new Promise((res, rej) => {
    Users.findById(id, (err, user) => {
      res(user);
    });
  });
};

module.exports = Admin;

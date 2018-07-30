const mongoose = require("mongoose");
const Company = mongoose.model("company");
const { templatePath, company } = require("../../data/settings");

const { generateList } = require("../helpers/list");

const { companyProfileList } = require("../../public/js/templates/company");
const { deleteAll } = require("../helpers/files");

const User = mongoose.model("users");
const MemberHash = mongoose.model("memberHash");
const Lists = mongoose.model("lists");

const Team = require("../helpers/members");
const { waterfall } = require("async");

const generator = require("generate-password");

const nodemailer = require("nodemailer");
const smtpSettings = require("../../data/smtp");

const saveTags = require("../helpers/tags");

const timezoneJson = require("timezones.json");

const companyController = {
  create: (req, res) => {
    let data = req.body;
    let user = req.user.id;

    data.type = req.params.type;
    data.creator = user;

    data.tags = data.tags ? data.tags.split(",") : null;

    saveTags(data.tags);

    new Company(data).save(err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/profile/companies/`);
    });
  },
  update: (req, res, next) => {
    if (req.body.status === "published" || req.body.status === "published")
      req.body.status = "moderation";

    req.body.tags = req.body.tags ? req.body.tags.split(",") : null;

    saveTags(req.body.tags);

    Company.update({ _id: req.params.id }, { $set: req.body }, err => {
      if (err) return res.send(err);
      res.redirect(`/${req.locale}/profile/companies/`);
    });
  },
  adminUpdate: (req, res) => {
    req.body.submitedAt = new Date().getTime();

    req.body.tags = req.body.tags ? req.body.tags.split(",") : null;
    saveTags(req.body.tags);

    Company.update({ _id: req.params.id }, { $set: req.body }, err => {
      if (err) return res.send(err);
      res.send({
        type: "success",
        text: "ok"
      });
    });
  },
  createView: (req, res) => {
    const { type } = req.params;
    Lists.find((err, lists) => {
      res.render(templatePath, {
        content: `../modules/profile/modules/company/${type}/index`,
        action: "create",
        lists,
        admin: false,
        type
      });
    });
  },
  updateView: (req, res) => {
    const { type } = req.params;
    Company.findOne(req.params).exec((err, obj) => {
      Lists.find((err, lists) => {
        res.render(templatePath, {
          content: `../modules/profile/modules/company/${type}/index`,
          action: "update",
          admin: false,
          lists,
          obj,
          type,
          teamList: Team.profileList,
          message: req.flash("companyMessage")
        });
      });
    });
  },
  profileListView: (req, res) => {
    let query = {
      $or: [{ creator: req.user.id }, { "members.userId": req.user.id }]
    };
    generateListPage(req, res, query);
  },
  delete: async (req, res) => {
    await deleteAll({ req, Model: Company });
    Company.deleteOne({ _id: req.params.id }, err => {
      if (err) return res.status(400).send({ err });
      res.send({ status: "ok", message: "Company was deleted" });
    });
  },
  addMember: (req, res) => {
    let userIsNew = false,
      password;
    waterfall(
      [
        done => {
          Company.findOne({ _id: req.params.companyId }).exec(
            (err, company) => {
              done(err, company);
            }
          );
        },
        (company, done) => {
          let { email } = req.body;
          if (req.body.add_me === "1") email = req.user.email;

          User.findOne({ email }, (err, user) => {
            done(err, company, user, email);
          });
        },
        (company, user, email, done) => {
          if (user) {
            Team.checkIfUserInTeam({ members: company.members, email })
              .then(() => {
                done(null, company, user);
              })
              .catch(err => {
                done(err, company);
              });
          } else {
            userIsNew = true;
            password = generator.generate({
              length: 10,
              numbers: true
            });

            let newUser = new User();

            newUser.email = req.body.email;
            newUser.originalEmail = req.body.email;
            newUser.name = req.body.name;
            newUser.phone = req.body.phone;
            newUser.authType = "local";
            newUser.password = newUser.generateHash(password);
            newUser.createdAt = new Date().getTime();

            newUser.save((err, user) => {
              done(err, company, user);
            });
          }
        },
        (company, user, done) => {
          const me = req.body.add_me === "1";
          const { email } = user;

          let member = {
            email,
            phone: user.phone,
            userId: user.id,
            name: user.name,
            image: user.image,
            surname: user.surname,
            position: req.body.position,
            companyRole: req.body.companyRole,
            about: req.body.about,
            adminRole: me ? "admin" : req.body.adminRole,
            confirmed: me ? true : false
          };

          if (!me) {
            let companyName =
              company.name.ru || company.name.en || company.name.ua;

            let memberHash = new MemberHash();
            memberHash.email = email;
            memberHash.userId = user.id;
            memberHash.companyId = company.id;
            memberHash.name = companyName;
            memberHash.hash = memberHash.generateHash();

            memberHash.save((err, item) => {
              nodemailer.createTestAccount(err => {
                if (err) console.log("error on createTestAccount");

                let transporter = nodemailer.createTransport(smtpSettings);

                let mailOptions = {
                  to: email,
                  subject: "Приглашение Letspartners",
                  html: `Вас пригласили как сотрудника компании <b>${companyName}</b>.<br/> Подтвердите свое сотрудничесво перейдя по <a href="http://${
                    req.headers.host
                  }/action/confirm?q=${item.hash}">ссылке</a>.`
                };

                if (userIsNew)
                  mailOptions.html += `<hr>
                  <p>Доступ к своему личному аккаунту:</p>
                  <p>Логин: ${email}</p>
                  <p>Пароль: ${password}</p>`;

                transporter.sendMail(mailOptions, (err, info) => {
                  if (err) return console.log("error on sending", err);
                  console.log("Email sending success!");
                });
              });
            });
          }

          company.update({ $push: { members: member } }, err => {
            done(err, company, me);
          });
        }
      ],
      (err, company, me) => {
        if (err) {
          req.flash("companyMessage", err);
        } else {
          const text = me
            ? "Вы добавлены в команду!"
            : "Добавлен новый учасник команды! Ему на email была отправлена ссылка с подтвеждением.";
          req.flash("companyMessage", {
            type: "success",
            text
          });
        }
        res.redirect(
          `/${req.locale}/profile/company/${req.body.type}/update/${
            company.id
          }#${req.body.hashtag}`
        );
      }
    );
  },

  updateMember: {
    get: (req, res) => {
      const { companyId, memberId } = req.params;
      Company.findById(companyId, (err, company) => {
        company.members.forEach(member => {
          if (member.id === memberId) {
            res.render(templatePath, {
              company,
              content:
                "../modules/profile/modules/company/components/_member_form",
              member,
              timezoneJson
            });
            return;
          }
        });
      });
    },
    post: (req, res) => {
      const redirectUrl = req.body.back;
      const { companyId, memberId } = req.params;
      Company.update(
        { _id: companyId, "members._id": memberId },
        { $set: { "members.$": req.body } },
        (err) => {
          res.redirect(redirectUrl);
        }
      );
    }
  },

  deleteMember: (req, res) => {
    const { companyId, memberId } = req.query;
    Company.update(
      { _id: companyId },
      { $pull: { members: { _id: memberId } } },
      (err, company) => {
        if (err)
          return res.send({
            type: "error",
            text: "Can`t delete member from company!"
          });
        res.send({
          type: "success",
          text: "Member was deleted from company"
        });
      }
    );
  },

  confirmUser: (req, res) => {
    MemberHash.findOne({ hash: req.query.q }, (err, item) => {
      if (!item) return res.send("nise try, good buy");

      let user = req.user;

      if (user && user.email === item.email) {
        Team.confirmParticipation({ item, req, user })
          .then(message => {
            MemberHash.deleteOne({ hash: req.query.q });
            req.flash("submitMember", message);
            res.redirect(`/${req.locale}/profile`);
          })
          .catch(err => {
            console.log("company.js error", err);
            req.flash("submitMember", {
              type: "error",
              text: JSON.stringify(err)
            });
            res.redirect(`/${req.locale}/profile`);
          });
      } else {
        req.logout();

        User.findOne({ email: item.email });

        res.redirect(`/${req.locale}/login?q=${item.hash}`);
      }
    });
  }
};

const generateListPage = (req, res, query) => {
  const perPage = company.profileList;
  const page = req.params.page || 1;
  const { locale } = req;
  return generateList({
    model: Company,
    query,
    page,
    perPage,
    locale,
    published: false
  })
    .then(({ objects, count }) => {
      res.render(templatePath, {
        objects,
        companyProfileList,
        content: `../modules/profile/modules/company/index`,
        current: page,
        pages: Math.ceil(count / perPage)
      });
    })
    .catch(err => res.send("error: /news" + err));
};

module.exports = companyController;

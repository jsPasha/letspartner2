const mongoose = require("mongoose");
const Company = mongoose.model("company");

const { teamList } = require("../../public/js/templates/team");

const Team = {
  checkIfUserInTeam: data => {
    const { members, email } = data;
    return new Promise((resolve, reject) => {
      let is = false;
      members.forEach(el => {
        if (el.email === email) is = true;
      });
      if (is) {
        reject({
          type: "error",
          text: `User with email ${email} alredy in team. If you want to update user data, select him in the list of team.`
        });
      } else {
        resolve();
      }
    });
  },

  issetUser: () => {},

  pushCompanyToUser: user => {},

  profileList: teamList,

  confirmParticipation: ({ item, req, user }) => {
    return new Promise((resolve, reject) => {
      
      const message = {
        type: "success",
        text: `Вы подтвердили участие в компании <b>${
          item.name
        }</b>. Для просмотра всех Ваших компаний перейдите в раздел <a href="/${
          req.locale
        }/profile/companies/"><b>Мои комании</b></a>`
      };

      Company.update(
        { _id: item.companyId, "members.userId": user.id },
        {
          $set: {
            "members.$.confirmed": true
          }
        },
        err => {
          if (err) return reject(err);
          if (!user.active) {
            user.update({ $set: { active: true } }, err => {
              if (err) return reject(err);
              resolve(message);
            });
          } else {
            resolve(message);
          }
        }
      );
    });
  }
};

module.exports = Team;

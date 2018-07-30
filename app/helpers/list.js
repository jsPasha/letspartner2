const moment = require("moment");

const generateList = params => {
  let { model, page, perPage, locale, published, query } = params;

  if (!query) query = {};
  else for (let key in query) if (!query[key]) delete query[key];

  if (!published) {
    return new Promise((res, rej) => {
      model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, objects) {
          if (err) return rej(err);
          model.count().exec(function(err, count) {
            if (err) return rej(err);
            if (objects)
              objects.forEach((el, i) => {
                let timeMoment = +el.activatedAt || +el.createdAt;
                moment.locale(locale);
                objects[i].moment = moment(timeMoment).format("LLL");
              });
            res({ objects, count });
          });
        });
    });
  } else {
    return new Promise((res, rej) => {
      model
        .find(query)
        .where("published")
        .equals(true)
        .sort({ createdAt: -1 })
        .skip(perPage * page - perPage)
        .limit(perPage)
        .exec(function(err, objects) {
          if (err) return rej(err);
          model.count({ published: true }).exec(function(err, count) {
            if (err) return rej(err);
            objects.forEach((el, i) => {
              let timeMoment = +el.activatedAt || +el.createdAt;
              moment.locale(locale);
              objects[i].moment = moment(timeMoment).format("LLL");
            });
            res({ objects, count });
          });
        });
    });
  }
};

module.exports = { generateList };

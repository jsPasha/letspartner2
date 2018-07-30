const mongoose = require("mongoose");
const Constants = mongoose.model("constants");

class LangConstants {
  constructor() {
    this.store = {};
  }

  isEmpty() {
    for (var prop in this.store) {
      if (this.store.hasOwnProperty(prop)) return false;
    }
    return JSON.stringify(this.store) === JSON.stringify({});
  }

  init() {
    return new Promise((res, rej) => {
      if (this.isEmpty()) {
        Constants.find({}, (err, data) => {
          if (err) return rej(err);
          data.forEach(el => (this.store[el.key] = el.value));
          res();
        });
      } else {
        res();
      }
    });
  }

  getValue(key) {
    if (this.store[key] !== "" && this.store[key]) {
      return this.store[key];
    } else if (this.store[key] !== "") {
      this.store[key] = "";
      this.setValue(key);
      return;
    } else {
      return;
    }
  }

  setValue(key) {
    addStore({ key }).then(data => {
      this.store[key] = data.value;
    });
  }
}

const addStore = ({ key, value }) => {
  return new Promise((res, rej) => {
    Constants.findOne({ key }, (err, data) => {
      if (err) return rej(err);
      if (!data) {
        let constant = new Constants({ key });
        constant.value = constant.setDefaultValue(key);
        constant.save((err, data) => {
          res(data);
        });
      } else {
        res(data);
      }
    });
  });
};

global.constants = new LangConstants();

module.exports = (req, res, next) => {
  constants.init().then(() => {
    global.__tr = key => {
      let a = constants.getValue(key);
      if (a) return a[req.locale];
      else return key;
    };
    next();
  });
};

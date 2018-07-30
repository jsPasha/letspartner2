const fs = require("fs");
const mongoose = require("mongoose");
const News = mongoose.model("news");
const _ = require("lodash");

const request = require("request");
const uniqid = require("uniqid");

const removeTempPath = (req, res, next) => {
  let files = req.body.images || { oneImage: req.body.image };

  for (let key in files) remove(files, key, req);
  if (req.body && req.body.floatContent)
    req.body.floatContent.forEach(el => {
      if (el.contentType === "gallery") {
        let gallery = el.gallery;
        if (gallery)
          gallery.forEach((el, index) => {
            remove(gallery, index);
          });
      }
    });

  if (req.body && req.body.floatContent === null) req.body.floatContent = [];

  next();
};

const remove = (images, key, req) => {
  let path = images[key];
  if (path && typeof path === "string" && path.split("/")[1] === "temp") {
    let oldPath = `public/uploads${path}`;
    let pathArr = path.split("/");
    pathArr.splice(1, 1);
    let newPath = pathArr.join("/");
    if (key === "oneImage") req.body.image = newPath;
    else images[key] = newPath;
    newPath = `public/uploads${newPath}`;
    replaceContents(newPath, oldPath, err => {
      if (err) console.log(err);
      fs.unlink(oldPath, err => {
        if (err) console.log(err);
      });
    });
  }
};

const deletePrevious = (req, res, next) => {
  let files = req.body.fileForDelete;
  if (files)
    files.forEach(el => {
      fs.unlink(`public/uploads${el}`, err => {
        if (err) console.log(err);
      });
    });
  next();
};

function replaceContents(file, replacement, cb) {
  fs.readFile(replacement, (err, contents) => {
    if (err) return cb(err);
    fs.writeFile(file, contents, cb);
  });
}

const deleteAll = ({ req, Model }) => {
  let _id = req.params.id;

  return new Promise((resolve, reject) => {
    Model.findById(_id, (err, obj) => {
      let images = obj ? obj.images : null;

      if (images)
        for (let key in images) {
          if (typeof images[key] === "string" && images[key] !== "")
            fs.unlink(`public/uploads${images[key]}`, err => {
              if (err) console.log(err);
            });
        }

      if (obj.floatContent)
        obj.floatContent.forEach(el => {
          if (el.contentType === "gallery") {
            let gallery = el.gallery;
            gallery.forEach((el, index) => {
              fs.unlink(`public/uploads${gallery[index]}`, err => {
                if (err) console.log(err);
              });
            });
          }
        });

      resolve();
    });
  });
};

const saveGoogleImage = url => {
  return new Promise((resolve, reject) => {
    const image = `/${uniqid()}.jpg`;
    let file = fs.createWriteStream(`public/uploads${image}`);

    let stream = request(url).pipe(file);

    stream.on("finish", () => resolve(image));
    stream.on("error", err => reject(err));
  });
};

module.exports = { removeTempPath, deletePrevious, deleteAll, saveGoogleImage };

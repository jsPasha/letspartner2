var syntax = "sass"; // Syntax: sass or scss;

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browsersync = require("browser-sync"),
  cleancss = require("gulp-clean-css"),
  rename = require("gulp-rename"),
  autoprefixer = require("gulp-autoprefixer"),
  notify = require("gulp-notify");

gulp.task("browser-sync", function() {
  browsersync({
    // server: {
    // 	proxy: ''
    // },
    proxy: "localhost:5000",
    notify: false
    // open: false,
    // tunnel: "projectname", //Demonstration page: http://projectname.localtunnel.me
  });
});

gulp.task("styles", function() {
  return gulp
    .src("public/" + syntax + "/**/*." + syntax + "")
    .pipe(sass({ outputStyle: "expand" }).on("error", notify.onError()))
    .pipe(rename({ suffix: ".min", prefix: "" }))
    .pipe(autoprefixer(["last 15 versions"]))
    .pipe(cleancss({ level: { 1: { specialComments: 0 } } })) // Opt., comment out when debugging
    .pipe(gulp.dest("public/css"))
    .pipe(browsersync.reload({ stream: true }));
});


gulp.task("watch", ["styles", "browser-sync"], function() {
  gulp.watch("public/" + syntax + "/**/*." + syntax + "", ["styles"]);
  gulp.watch(["public/libs/**/*.js", "public/dist/bundle.js"], browsersync.reload);
  gulp.watch("views/**/*.ejs", browsersync.reload);
});

gulp.task("default", ["watch"]);

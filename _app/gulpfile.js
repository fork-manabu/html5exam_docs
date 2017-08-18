var
  gulp = require('gulp'),
  pug = require('gulp-pug'),
  data = require('gulp-data'),
  plumber = require("gulp-plumber"),
  notify = require('gulp-notify'),
  gwatch = require('gulp-watch'),
  jsonPath = "./src/data.json";


gulp.task('pug', function () {
  return gulp.src(['./src/**/*.pug', '!./src/**/_*.pug'])
    .pipe(data(function (file) {
      return pugSetVars(file);
    }))
    .pipe(plumber({errorHandler: notify.onError("Error: <%= error.message %>")}))
    .pipe(pug({pretty: true}))
    .pipe(gulp.dest('../html/'));
});


function pugSetVars(file) {
  //jsonファイルPath
  var _json = require(jsonPath);
  var filename = file.relative.replace("pug", "html");
  var r_filename = "/" + filename.replace(/\\/g, '/');
  var file_ary = r_filename.split("/");
  return {
    __dirname: file_ary,
    __filename: r_filename,
    config: {
      default: _json.default,
      local: _json.local[r_filename]
    }
  };
}

// gulp build タスク
gulp.task('build', ['pug']);

// gulp watch タスク
gulp.task('watch', function () {
  gwatch('./src/**/*.pug', function (event) {
    gulp.start("pug")
  });
});

// gulp デフォルト
gulp.task('default', function () {
  gwatch('./src/**/*.pug', function (event) {
    gulp.start("pug")
  });
});

/**
 * Watch and handle workflow automation tasks.
 *
 * @author Louis Young
 * @version 4.0.0
 * @licence MIT
 */

import gulp from "gulp";
import webpack from "webpack-stream";
import sass from "gulp-sass";
import eslint from "gulp-eslint";
import sassLint from "gulp-sass-lint";
import htmlLint from "gulp-html-lint";
import plumber from "gulp-plumber";
import autoprefixer from "gulp-autoprefixer";
import imagemin from "gulp-imagemin";
import sourcemaps from "gulp-sourcemaps";
import rename from "gulp-rename";
import del from "del";
import zip from "gulp-zip";
import log from "fancy-log";
import colour from "ansi-colors";
import browserSync from "browser-sync";

const browserSyncServer = browserSync.create();

const paths = {
  src: "../public/src/",
  dist: "../public/dist/",
  build: "../build/",
  package: ["../public/dist/**.**", "../public/dist/**/*", "../public/dist/.htaccess"],
};

const icons = {
  success: "✓",
  warn: "⚠",
  info: "ℹ",
};

let production = false;

const compileStyles = () => {
  log.info(colour.blue(`${icons.info} Styles compiled`));

  return gulp
    .src(`${paths.src}stylesheets/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(
      sassLint({
        configFile: ".sass-lint.json",
      })
    )
    .pipe(sassLint.format())
    .pipe(
      sass({
        outputStyle: "compressed",
        errLogToConsole: true,
        includePaths: `${paths.src}stylesheets`,
      })
    )
    .on("error", sass.logError)
    .pipe(autoprefixer())
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}stylesheets/`))
    .pipe(browserSyncServer.stream());
};

gulp.task("compileStyles", compileStyles);

const compileScripts = () => {
  const stream = gulp.src(`${paths.src}scripts/*.js`);
  stream.pipe(plumber()).pipe(eslint(".eslintrc.json")).pipe(eslint.format());

  return gulp
    .src(`${paths.src}scripts/entry.js`)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(
      webpack({
        mode: production ? "production" : "development",
        entry: `${paths.src}scripts/entry.js`,
        target: "web",
        output: {
          filename: "bundle.min.js",
        },
        stats: {
          version: false,
          timings: false,
          builtAt: false,
          entrypoints: false,
        },
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(`${paths.dist}scripts/`));
};

gulp.task("compileScripts", compileScripts);

const compileMarkup = () => {
  log.info(colour.blue(`${icons.info} Markup compiled`));

  return gulp
    .src(`${paths.src}**/*.html`)
    .pipe(plumber())
    .pipe(
      htmlLint({
        htmllintrc: ".html-lintrc.json",
        useHtmllintrc: true,
      })
    )
    .pipe(htmlLint.format())
    .pipe(gulp.dest(`${paths.dist}`));
};

gulp.task("compileMarkup", compileMarkup);

const updateConfiguration = () => {
  log.info(colour.blue(`${icons.info} Configuration updated`));

  return gulp
    .src(`${paths.src}**/*.{htaccess,txt}`, { dot: true })
    .pipe(plumber())
    .pipe(gulp.dest(`${paths.dist}`));
};

gulp.task("updateConfiguration", updateConfiguration);

const compressAssets = () => {
  log.info(colour.blue(`${icons.info} Assets optimised`));

  return gulp
    .src(`${paths.src}assets/**/*`)
    .pipe(plumber())
    .pipe(
      imagemin([
        imagemin.jpegtran({
          progressive: true,
          silent: true,
          verbose: false,
        }),
        imagemin.optipng({
          optimizationLevel: 5,
          silent: true,
          verbose: false,
        }),
        imagemin.gifsicle({
          interlaced: true,
          silent: true,
          verbose: false,
        }),
        imagemin.svgo({
          silent: true,
          verbose: false,
          plugins: [{ removeViewBox: false }],
        }),
      ])
    )
    .pipe(gulp.dest(`${paths.dist}assets/`));
};

gulp.task("compressAssets", compressAssets);

const lintStyles = () => {
  return gulp
    .src(`${paths.src}stylesheets/**/*.scss`)
    .pipe(plumber())
    .pipe(
      sassLint({
        configFile: ".sass-lint.json",
      })
    )
    .pipe(sassLint.format());
};

gulp.task("lintStyles", lintStyles);

const lintScripts = () => {
  return gulp.src(`${paths.src}scripts/**.*`).pipe(plumber()).pipe(eslint(".eslintrc.json")).pipe(eslint.format());
};

gulp.task("lintScripts", lintScripts);

const lintMarkup = () => {
  return gulp
    .src(`${paths.src}**/*.html`)
    .pipe(
      htmlLint({
        htmllintrc: ".html-lintrc.json",
        useHtmllintrc: true,
      })
    )
    .pipe(htmlLint.format());
};

gulp.task("lintMarkup", lintMarkup);

const clean = () => {
  log.info(colour.green(`${icons.success} Distributable directory cleaned`));
  log.info("");

  return del(`${paths.dist}**`, {
    force: true,
  });
};

gulp.task("clean", clean);

const cleanBuild = () => {
  log.info(colour.green(`${icons.success} Build directory cleaned`));

  return del(`${paths.build}**`, {
    force: true,
  });
};

gulp.task("cleanBuild", cleanBuild);

const cleanAssets = () => {
  return del(`${paths.dist}/assets/**`, {
    force: true,
  });
};

gulp.task("cleanAssets", cleanAssets);

const server = () => {
  browserSyncServer.init({
    server: paths.dist,
    notify: false,
    scrollProportionally: false,
    logLevel: "silent",
  });

  log.info(colour.green(`${icons.success} Starting the development server...`));
  log("");
};

gulp.task("server", server);

const lint = (callback) => {
  log.info(colour.green(`${icons.success} Linted`));
  callback();
};

gulp.task("lint", gulp.parallel(gulp.parallel([lintStyles, lintScripts, lintMarkup]), lint));

const compile = (callback) => {
  if (production) {
    log("");
    log.info(colour.green(`${icons.success} Production version built`));
  }
  callback();
};

gulp.task(
  "compile",
  gulp.series(
    "clean",
    gulp.parallel(["updateConfiguration", "compileMarkup", "compileStyles", "compileScripts", "compressAssets"]),
    compile
  )
);

const build = (callback) => {
  production = true;
  callback();
};

gulp.task("build", gulp.series(build, "compile"));

const compress = () => {
  log.info(colour.green(`${icons.success} Production build packaged`));

  gulp.src(paths.package).pipe(plumber()).pipe(gulp.dest("../build/"));

  return gulp.src(paths.package).pipe(plumber()).pipe(zip("build.zip")).pipe(gulp.dest("../"));
};

gulp.task("compress", compress);

gulp.task("package", gulp.series(["cleanBuild", "build", "compress", "lint"]));

const reload = (callback) => {
  browserSyncServer.reload();
  callback();
};

const stream = (callback) => {
  browserSyncServer.stream();
  callback();
};

const watch = () => {
  gulp.watch(`${paths.src}**/.htaccess`, gulp.series(updateConfiguration, reload));
  gulp.watch(`${paths.src}**/*.{htaccess,txt}`, gulp.series(updateConfiguration, reload));
  gulp.watch(`${paths.src}**/*.html`, gulp.series(compileMarkup, reload));
  gulp.watch(`${paths.src}stylesheets/**/*.scss`, gulp.series(compileStyles, stream));
  gulp.watch(`${paths.src}scripts/**`, gulp.series(compileScripts, reload));
  gulp.watch(`${paths.src}assets/**`, gulp.series(cleanAssets, compressAssets, reload));

  if (!production) {
    log.info(colour.yellow(`${icons.warn} Note that the development build is not optimised`));
    log("");
  }
  log.info(colour.green(`${icons.success} Watching changes...`));
  log("");
};

gulp.task("watch", watch);

gulp.task("start", gulp.parallel("server", "watch", "compile"));

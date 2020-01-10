var gulp = require("gulp"),
  browserSync = require("browser-sync").create(),
  qr = require("qrcode-terminal"),
  rollup = require("rollup");

gulp.task("browser-sync", function () {
  browserSync.init({
      server: {
        baseDir: "./dist/",
        index: "index.html"
      },
      port: 3000,
      open: true,
      startPath: '',
    },
    function () {
      externalUrl = browserSync.getOption('urls').get('external');
      qr.generate(externalUrl);
    });
});

gulp.task("bs-reload", function () {
  browserSync.reload();
});

gulp.task("default", ["browser-sync"], function () {
  gulp.watch("./src/**/*.ts", async () => {
    const rollupConfig = require("./rollup.config");
    await rollup.rollup(rollupConfig)
      .then(async bundle => {
        await bundle.write(rollupConfig.output)
      })
      .catch(error => console.error(error))
  });

  gulp.watch("./dist/**/*.js", ["bs-reload"]);
});
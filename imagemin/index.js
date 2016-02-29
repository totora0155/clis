#!/usr/bin/env node

const path = require('path');
const fsp = require('fs-promise');
const Imagemin = require('imagemin');
const pngquant = require('imagemin-pngquant');
const gulpRename = require('gulp-rename');
const opts = require('minimist')(process.argv.slice(2));
const cwd = process.cwd();

const pattern = opts._[0];

if (!pattern) return;

new Imagemin()
  .src(path.join(cwd, pattern))
  .use(gulpRename((_path) => {
    _path.extname = '.min' + _path.extname;
    return _path;
  }))
  .use(pngquant({
    speed: 2,
  }))
  .run((err, files) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }

    const promises = files.map((file) => {
      const outputFile = file.history[file.history.length - 1];
      const buf = file._contents;
      return fsp.writeFile(outputFile, buf);
    });

    Promise.all(promises)
      .then(() => {
        console.log('done');
      });

    // fs.writeFileSync(outputFile, buf, 0, buf.length, 0);
  });

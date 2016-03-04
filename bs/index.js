#!/usr/bin/env node

const fs = require('fs');
const jsonfile = require('jsonfile');
const exec = require('child_process').exec;
const assign = require('object-assign');
const bs = require('browser-sync').create();
const config = require('./bs-config');
const cwd = process.cwd();
const opts = require('minimist')(process.argv.slice(2));

const historyPath = __dirname + '/history.json';

if (opts.e || opts.edit) {
  exec(`open ${__dirname + '/bs-config.js'}`, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
  });
  process.exit(0);
}

if (opts._[0]) {
  if (opts.p || opts.proxy) {
    const proxy = opts._[0];
    config.proxy = proxy;
  } else {
    const baseDir = opts._[0];
    if (typeof config.server !== 'object') {
      config.server = {};
    }
    config.server.baseDir = baseDir;
  }
} else {
  if (typeof config.server !== 'object') {
    config.server = {};
  }
  config.server.baseDir = cwd;
}

if (opts.i || opts.index) {
  const index = opts.i || opts.index;
  if (typeof config.server !== 'object') {
    config.server = {};
  }
  config.server.index = index;
}

addHistory();
bs.init(config);

function addHistory() {
  ensureExists(historyPath, {histories: []})
    .then(readJson)
    .then(writeJson.bind(null, config))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

function ensureExists(jsonPath, initValue) {
  return new Promise((resolve) => {
    fs.access(jsonPath, fs.F_OK, (err) => {
      if (err) {
        fs.writeFile(jsonPath, JSON.stringify(initValue), 'utf-8', () => {
          return resolve({jsonPath});
        });
      } else {
        return resolve({jsonPath});
      }
    });
  })
}

function readJson(data) {
  const jsonPath = data.jsonPath;

  return new Promise((resolve, reject) => {
    jsonfile.readFile(jsonPath, (err, obj) => {
      if (err) {
        return reject(err);
      }
      return resolve({jsonPath, obj});
    });
  });
}

function writeJson(config, data) {
  const jsonPath = data.jsonPath;
  const obj = data.obj;
  const history = `bs ${process.argv.slice(2).join(' ')}`.trim();
  obj.histories.unshift(history);

  return new Promise((resolve, reject) => {
    jsonfile.writeFile(jsonPath, obj, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  });
}

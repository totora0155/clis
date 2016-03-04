#!/usr/bin/env node

const fs = require('fs');
const exec = require('child_process').exec;
const assign = require('object-assign');
const bs = require('browser-sync').create();
const config = require('./bs-config');
const cwd = process.cwd();
const opts = require('minimist')(process.argv.slice(2));

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

bs.init(config);

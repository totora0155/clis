#!/usr/bin/env node

const Color = require('color');
const isColor = require('is-color');
const opts = require('minimist')(process.argv.slice(2));

process.stdin.resume();
process.stdin.setEncoding('utf8');

process.stdin.on('data', (color) => {
  if (!isColor(color)) return;

  const grey = Color(color.trim()).greyscale();

  if (!opts.f && !opts.format) {
    stdoutHex(grey);
  } else if (opts.f === 'rgb' || opts.format === 'rgb') {
    stdoutRGB(grey);
  } else if (opts.f === 'hsl' || opts.format === 'hsl') {
    stdoutHSL(grey);
  }
});

setTimeout(() => {
  process.exit(1);
}, 10)

function stdoutHex(grey) {
  console.log(grey.hexString());
}

function stdoutRGB(grey) {
  console.log(grey.rgbString());
}

function stdoutHSL(grey) {
  console.log(grey.hslString());
}

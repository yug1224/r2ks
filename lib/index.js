#!/usr/bin/env node

const assert = require('assert');
const fs = require('fs');
const moment = require('moment');
const opts = require('commander');
const path = require('path');
const pug = require('pug');
const now = moment();

const version = require(`${__dirname}/../package.json`).version;

opts
  .version(version)
  .option('--history [filePath]', 'generate personal history html')
  .option('--generate', 'output template JSON file')
  .parse(process.argv)

if (opts.generate) {
  // Template JSONの出力
  fs.writeFileSync('template.json', fs.readFileSync(`${__dirname}/template.json`), 'utf8');
} else if (opts.history) {
  // 履歴書の作成
  const pathObject = path.parse(opts.history)
  if (!pathObject.root) {
    pathObject.root = '/';
    pathObject.dir = `${process.env.PWD}/${pathObject.dir}`
  }

  const data = Object.assign({now: now.format('YYYY年 MM月 DD日 現在')}, require(path.format(pathObject)).history);
  const age = now.diff(moment(data.birth.year + data.birth.month + data.birth.day, 'YYYYMMDD'), 'years');
  data.birth = `${data.birth.year}年 ${data.birth.month}月 ${data.birth.day}日生 (満${age}歳)`

  const html = pug.renderFile(`${__dirname}/history.pug`, {
    pretty: true,
    data: data
  });

  fs.writeFileSync('history.html', html, 'utf8');
} else if (opts.resume) {
  // 職務経歴書の作成
  // TODO
} else {
  // noop
}

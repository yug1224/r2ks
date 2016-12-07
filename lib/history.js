const fs = require('fs');
const moment = require('moment');
const pug = require('pug');
const now = moment();

const data = Object.assign({now: now.format('YYYY年 MM月 DD日 現在')}, require('src/history.json'));
const age = now.diff(moment(data.birth.year + data.birth.month + data.birth.day, 'YYYYMMDD'), 'years');
data.birth = `${data.birth.year}年 ${data.birth.month}月 ${data.birth.day}日生 (満${age}歳)`

const html = pug.renderFile('./lib/history.pug', {
  pretty: true,
  data: data
});

fs.writeFileSync('dst/history.html', html, 'utf8');

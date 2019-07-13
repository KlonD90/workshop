const initial_dictionary = require('./ors_halmg_tol.json');
const R = require('ramda');

const startPoint = [
  'соед.',
  'межд.',
  'нареч.',
  'мн. ч.',
  'нескл.',
  'род. п.',
  'предлог',
  'м.',
  'сущ.',
  'союз',
  'ед. ч.',
  'накл.',
  'усл.',
  'cл.',
  'частица',
  'вводн. сл.',
  'п.',
  'сов.',
  'числ.',
  'двух-',
  'сказ.',
  ')',
  'вр.',
  'прил.',
  'I'
];

console.log(R.toPairs(initial_dictionary).map(([word, translate]) => {
  const entries = startPoint.map(x => {
    const index = translate.indexOf(x);
    return [index, index + x.length]
  }).filter(([x]) => x >= 0).reduce((res, x) => x.index > res.index ? x : res);
  const startIndex = entries[0];
  const result = translate.slice(startIndex);
  console.log(word);
  return result;
}).filter(R.identity).slice(0, 100))

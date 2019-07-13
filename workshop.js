const fs = require('fs')

const assert = require('assert')
const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router()
const koaBody = require('koa-body')

const {sequelize, Word, WordLink} = require('./models')
const dictionaryUrl = '/words/'


const addWord = async ({langFrom, wordFrom, langTo, wordTo}) => {
  const [res_a, created_a] = await Word.findOrCreate({
    where: {
      lang: langFrom,
      word: wordFrom
    },
    defaults: {
      lang: langFrom,
      word: wordFrom      
    }
  })

  const [res_b, created_b] = await Word.findOrCreate({
    where: {
      lang: langTo,
      word: wordTo,
    },
    defaults: {
      lang: langTo,
      word: wordTo,
    }
  })

  await WordLink.findOrCreate({
    where: {
      word_a: res_a.id,
      word_b: res_b.id
    },
    defaults: {
      word_a: res_a.id,
      word_b: res_b.id      
    }
  })
}

const alphabets = [
  "а", "о", "у", "ы", "э", "я", "е", "ё", "ю", "и", "б", "в", "г", "д", "й", "ж", "з", "к", "л", "м", "н", "п", "р", "с", "т", "ф", "х", "ц", "ч", "ш", "щ", "ь", "ъ"
];

const getSingleWord = async ({word, langFrom, langTo}) => {
  const res = await sequelize.query(`
    SELECT w2.* 
    FROM "Words" w1 
    INNER JOIN "WordLinks" wl on wl.word_a = w1.id 
    INNER JOIN "Words" w2  on w2.id = wl.word_b
    WHERE w1.word = $1 
    AND w1.lang = $2
    `, {
      bind: [word, langFrom],
      type: sequelize.QueryTypes.SELECT
    }
  )
  return res
}

const replaceChar = (word, i, char) => {
  const arrWord = word.split('')
  arrWord[i] = char;
  return arrWord.join('');
}
const generateWordForm = (word, alphabet) => {
  const res = []
  for (let i =0; i < word.length; i++) {
    for (const char of alphabet) {
      res.push(replaceChar(word, i, char))
    }
  }
  return res
}

const getWord = async ({word, langFrom, langTo}) => {
  const specificResult = await getSingleWord({word, langTo, langFrom})
  if (specificResult.length > 0) {
    return specificResult
  }
  const wordForms = [word].concat(generateWordForm(word, alphabets))
  const possibleWords = await Promise.all(wordForms
    .map(
      x => getSingleWord({word: x, langFrom, langTo})
    )
  )
  const allWords = possibleWords.reduce((r, x) => r.concat(x), []);
  const wordSet = new Set(
    allWords.map(x => JSON.stringify(x))
  );
  return Array.from(wordSet).map(x => JSON.parse(x))
}

[1, 2, 3].map(x => x + 1)
const errorHandlingMiddleware = async (ctx, next) => {
  try {
    await next()
  } catch({message}) {
    errorMessage(ctx, {message})
  }
}
const errorMessage = (ctx, {message, status = 422}) => {
  ctx.status = status
  ctx.body = {code: 'error', message}
}
const okMessage = (ctx, data) => {
  ctx.body = {code: 'ok', data}
}

const normalizeWord = word => word.toLocaleLowerCase().normalize('NFC')

router.post(dictionaryUrl, koaBody(), errorHandlingMiddleware, async ctx => {
  const {kalmyk, russian} = ctx.request.body;
  assert.ok(kalmyk, 'should have kalmyk')
  assert.ok(russian, 'should have russian')
  assert.ok(typeof kalmyk === 'string', 'kalmyk should be string')
  assert.ok(typeof russian === 'string', 'russian should be string')
  await addWord({
    langFrom: 'kalmyk',
    langTo: 'russian',
    wordFrom: normalizeWord(kalmyk),
    wordTo: normalizeWord(russian),
  })
  okMessage(ctx)
})

const availableLanguages = ['russian', 'kalmyk'];
router.get(dictionaryUrl, errorHandlingMiddleware, async ctx => {
  const {word, langFrom, langTo} = ctx.query;
  assert.ok(word, 'should be word')
  assert.ok(typeof word, 'word should be string')
  const normalizedWord = normalizeWord(word)
  assert.ok(availableLanguages.includes(langFrom), 'lang from should be available language')
  assert.ok(availableLanguages.includes(langTo), 'lang to should be available language')
  assert.ok(langTo !== langFrom, 'lang from should be not equal lang to')
  const result = await getWord({word: normalizedWord, langFrom, langTo})
  if (!result) {
    return void errorMessage(ctx, {message: 'word not found', status: 404});
  }
  okMessage(ctx, result)
})

app.use(router.routes())

app.listen(3000)


process.on('SIGINT', () => {
  process.exit(0);
})

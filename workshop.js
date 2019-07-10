const fs = require('fs')

const assert = require('assert')
const Koa = require("koa")
const Router = require("koa-router")
const app = new Koa()
const router = new Router()
const koaBody = require('koa-body')

const dictionaryUrl = '/words/'


const dictionaryFile = 'dictionary.json'

const flushDb = () => {
  fs.writeFileSync(dictionaryFile, JSON.stringify(dictionary), {encoding: 'utf8'})
}

const readDb = () =>  {
  try{
    return JSON.parse(fs.readFileSync(dictionaryFile, {encoding: 'utf8'}))
  } catch(e) {
    return defaultStateDictionary
  }
}

const defaultStateDictionary = [];


const dictionary =  readDb()

const addWord = async ({kalmyk, russian}) => {
  dictionary.kalmyk[kalmyk] = russian
  dictionary.russian[russian] = kalmyk
  flushDb()
}

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

router.post(dictionaryUrl, koaBody(), errorHandlingMiddleware, async ctx => {
  const {kalmyk, russian} = ctx.request.body;
  assert.ok(kalmyk, 'should have kalmyk')
  assert.ok(russian, 'should have russian')
  assert.ok(typeof kalmyk === 'string', 'kalmyk should be string')
  assert.ok(typeof russian === 'string', 'russian should be string')
  await addWord({kalmyk, russian})
  okMessage(ctx)
})

const getWord = async ({word, langFrom, langTo}) => {
  return dictionary.kalmyk[word] || dictionary.russian[word];
}

const availableLanguages = ['russian', 'kalmyk'];
router.get(dictionaryUrl, errorHandlingMiddleware, async ctx => {
  const {word, langFrom, langTo} = ctx.query;
  assert.ok(word, 'should be word')
  assert.ok(typeof word, 'word should be string')
  assert.ok(availableLanguages.includes(langFrom), 'lang from should be available language')
  assert.ok(availableLanguages.includes(langTo), 'lang to should be available language')
  assert.ok(langTo !== langFrom, 'lang from should be not equal lang to')
  const result = await getWord({word, langFrom, langTo})
  if (!result) {
    return void errorMessage(ctx, {message: 'word not found', status: 404});
  }
  okMessage(ctx, result)
})

app.use(router.routes())

app.listen(3000)




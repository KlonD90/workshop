const R = require('ramda')
const axios = require('axios')
const dictionary = require('./dictionaries/halimag_oros_toli')

const isOneWord = (str) => str.trim().split(/[ \.;,]/).length === 1

const numStartEx = /^\d\)/
const numStart = (str) => {
  return numStartEx.test(str)
}

const metaRegex = /^\w+\./
const isMeta = (str) => metaRegex.test(str.trim())

const from = 'от'

const translated = R.compose(
    R.reduce((r, x) => r.concat(x), []),
    R.filter(x => x),
    R.map(([word, {translations, transcript}]) => {
      if (translations.length === 1 && isOneWord(translations[0])) {
        return [[word, translations[0]]]
      }

      if (translations) {
        const acc = []
        for (const t of translations) {
          if (numStart(t)) {
            // single word case
            const startStr = t.slice(2).trim();
            const words = startStr.split(' ').filter(x => x)
            if (words.length === 1) {
              acc.push([word, words[0]])
            }
          }
        }
        if (acc.length) return acc
      }



      return false
    }),
    // R.slice(0, 100),
    R.toPairs,
  )(dictionary)

const send = async (d) => {
  for (const [word, translation] of d) {
    try {
      await axios.post(`http://80.93.177.192:3000/words/`, {kalmyk: word, russian: translation})
    } catch(e) {
      console.log(e)
      process.exit(1)
    }
  }
}
send(translated)

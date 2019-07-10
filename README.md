# Nodejs Workshop

You need install nodejs before start. Any version greater or equal than 8 is acceptable.

To install:

`npm i`

To run: 

`node workshop.js`

To test:

Add word: 

`curl -H "Content-Type: application/json" -d '{"kalmyk": "эцк", "russian": "отец"}' -x POST 'localhost:3000/words'

Search for word: 

`curl 'localhost:3000/words?word=эцк'`

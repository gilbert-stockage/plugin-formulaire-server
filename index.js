const express = require('express')
const app = express()
const Hubspot = require('hubspot')
const cors = require('cors')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/', function (req, res) {
  res.send('403 Unauthorized.')
})

app.post('/createOrUpdate', jsonParser, function (req, res) {
  const hubspot = new Hubspot({
    apiKey: 'e68542ee-c8b4-4dd9-8825-b979777ff6d1',
    checkLimit: false
  })
  hubspot.contacts.createOrUpdate(req.body.email, {
    "properties": req.body.properties
  })
    .then((data) => {
      res.send(data)
    })
    .catch((err) => {
      res.send(err)
    })
})

app.listen(PORT, function () {
  console.log(`Gilbert Hubspot app running on ${PORT}`)
})

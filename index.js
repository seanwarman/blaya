const fs = require('fs')
const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express()
const instantiateHttp = require('http')
const instantiateHttps = require('https')
const instantiateIO = require('socket.io')
require('dotenv').config()
const router = require('./router')

const { PRIV_KEY, CERTIFICATE, ENVIRONMENT, BASIC_AUTH_USERS, PORT = 80 } = process.env

let io;
let http;
let https;

const production = (!ENVIRONMENT || ENVIRONMENT === 'production') && PORT === 443

if (production) {
  const priv = fs.readFileSync(PRIV_KEY)
  const cert = fs.readFileSync(CERTIFICATE)
  https = instantiateHttps.createServer({
    key: priv,
    cert: cert,
  }, app)
  io = instantiateIO(https)
} else {
  http = instantiateHttp.Server(app)
  io = instantiateIO(http)
}

let reloaded = false
io.on('connection', () => {
  if (!reloaded) io.emit('reload')
  reloaded = true
})

app.use(basicAuth({
  users: BASIC_AUTH_USERS.split(',').reduce((acc, userpass) => {
    const [username, password] = userpass.split(':')
    return {
      ...acc,
      [username]: password,
    }
  }, {}),
  challenge: true,
}))

app.use(express.static('public'))
app.use('/public', express.static('public'))
app.use('/node_modules', express.static('node_modules'))

router(app)

const listen = () => {
	console.log(`Blaya listening on port ${PORT}`)
}

if (production) {
  https.listen(PORT, listen)
} else {
  http.listen(PORT, listen)
}

import fs from 'fs'
import express from 'express'
import basicAuth from 'express-basic-auth'
const app = express()
import instantiateHttp from 'http'
import instantiateHttps from 'https'
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
import router from './router.js'

dotenv.config()

const { PRIV_KEY, CERTIFICATE, BASIC_AUTH_USERS, PORT = 80 } = process.env

let io;
let http;
let https;

const production = PORT === '443'

if (production) {
  const priv = fs.readFileSync(PRIV_KEY)
  const cert = fs.readFileSync(CERTIFICATE)
  https = instantiateHttps.createServer({
    key: priv,
    cert: cert,
  }, app)
  io = new Server(https)
} else {
  http = instantiateHttp.Server(app)
  io = new Server(http)
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

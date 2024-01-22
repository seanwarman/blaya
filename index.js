import fs from 'fs'
import { S3Client } from '@aws-sdk/client-s3'
import express from 'express'
import basicAuth from 'express-basic-auth'
const app = express()
import instantiateHttp from 'http'
import instantiateHttps from 'https'
import { Server } from 'socket.io'
import * as dotenv from 'dotenv'
import router from './router.js'

dotenv.config()

const { PRIV_KEY, CERTIFICATE, BASIC_AUTH_USERS, PORT = 80, TEST = false } = process.env

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
  if (!reloaded) io.emit('RELOAD')
  reloaded = true
})


if (!TEST) {
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
}

const options = {
  dotfiles: 'ignore',
  setHeaders: (res) => {
    res.set('Cache-Control', 'private, max-age=0')
  },
}

app.use(express.static('public', options))
app.use('/public', express.static('public', options))
app.use('/node_modules', express.static('node_modules', options))
if (!TEST) {
  app.use((req, _, next) => {
    const s3 = new S3Client({ region: 'eu-west-2' })
    req.context = {
      io,
      s3,
    }
    next()
  })
} else {
  app.use((req, _, next) => {
    const s3 = {
      send: async () => ({
        AcceptRanges: '',
        ContentLength: '',
        ContentType: '',
        ContentRange: '',
        Body: { on: (type, cb) => { type === 'end' ? cb() : null } },
      }),
    };
    req.context = {
      io,
      s3,
    };
    next();
  });
}

router(app)

const listen = () => {
	console.log(`Blaya listening on port ${PORT}`)
}

if (production) {
  https.listen(PORT, listen)
} else {
  http.listen(PORT, listen)
}

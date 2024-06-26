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
import testRoutes from './__test/test-routes.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url));

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
  fallthrough: true,
  extensions: ['js'],
  setHeaders: (res) => {
    res.set('Cache-Control', 'max-age=0');
  },
};

function redirectWithExt(req, res) {
  // Some node module files have extra extensions like 'worklet.js' which
  // confuses express, manually add the .js to the end of these...
  res.redirect('/node_modules' + req.path + '.js');
}

app.use(express.static('public', options))
app.use('/public', express.static('public', options))
if (TEST) {
  app.use('/__test', express.static('__test', options))
}
app.use('/node_modules', express.static('node_modules', options), redirectWithExt)
app.use('/node_modules', express.static('node_modules', options), redirectWithExt)

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
      send: async (command) => {
        const path = __dirname + '/' + command.input.Key;
        const range = command.input.Range;
        const size = Buffer.byteLength(fs.readFileSync(path));
        let [start, end] = range?.replace(/bytes=/, '').split('-') || ['0'];
        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : size - 1;
        if (!isNaN(start) && isNaN(end)) {
          start = start;
          end = size - 1;
        }
        if (isNaN(start) && !isNaN(end)) {
          start = size - end;
          end = size - 1;
        }
        return {
          AcceptRanges: 'bytes',
          ContentLength: end - start + 1,
          ContentType: 'audio/mpeg',
          ContentRange: `bytes ${start}-${end}/${size}`,
          Body: fs.createReadStream(path, ...(end ? [{ start, end }] : [])),
        };
      },
    };
    req.context = {
      io,
      s3,
    };
    next();
  });
}

router(app)
if (TEST) {
  testRoutes(app);
}

const listen = () => {
	console.log(`Blaya listening on port ${PORT}`)
}

if (production) {
  https.listen(PORT, listen)
} else {
  http.listen(PORT, listen)
}

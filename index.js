const express = require('express')
const basicAuth = require('express-basic-auth')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
require('dotenv').config()
const router = require('./router')

const { BASIC_AUTH_USERS, PORT = 80 } = process.env

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

http.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})

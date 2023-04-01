const express = require('express')
const basicAuth = require('express-basic-auth')
const { readdir, access, constants } = require('fs')
const { spawn, exec } = require('child_process')
const app = express()
require('dotenv').config()

const { BASIC_AUTH_USERS, PORT = 80 } = process.env

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

// Something to refresh the index and remove any cached files...
// setInterval(() => {
//      exec('rm -rf ' + __dirname + '/complete')
// 	exec(__dirname + '/./ls_s3.sh > ' + __dirname + '/index.html')
// }, 1000000)

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html')
})

function streamFile(req, res) {
	const filePath = req.params[0]
	const cp = spawn('aws', ['s3', 'cp', 's3://everest-files' + filePath, '-'])
	cp.stdout.pipe(res)
}

function cleanDir(req, res, next) {
	readdir(__dirname + '/complete', (error, files) => {
		if(error) {
      console.log('@FILTER error:', error)
      return next()
    }

    console.log('files.length: ', files.length)

		if (files.length > 3) {
			const rm = spawn('rm', ['-rf', __dirname + '/complete'])
			rm.on('error', (error) => {
				console.log(error)
			})
			rm.on('close', () => {
        const mkdir = spawn('mkdir', [__dirname + '/complete'])
        mkdir.on('error', (error) => {
          console.log(error)
        })
        mkdir.on('close', () => next())
      })
		} else {
			next()
		}
	})

}

function copySendFile(req, res) {
	const filePath = req.params[0]

	access(__dirname + filePath, constants.F_OK, (err) => {
		if (!err) return res.sendFile(__dirname + filePath)

		const cp = spawn('aws', ['s3', 'cp', 's3://everest-files' + filePath, __dirname + filePath])

		cp.on('error', error => {
			console.log(error)
			res.send(error)
		})
		cp.on('close', () => {
			res.sendFile(__dirname + filePath)
		})
	})

}

app.get('*', cleanDir, copySendFile)

app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
})

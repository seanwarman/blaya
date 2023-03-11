const express = require('express')
const { readdir, access, constants } = require('fs')
const { spawn, exec } = require('child_process');
const app = express()
const port = 80

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
		if(error) return console.log(error)

		if (files.length > 3) {
			const rm = spawn('rm', ['-rf', __dirname + '/complete/*'])
			rm.on('error', (error) => {
				console.log(error)
			})
			rm.on('close', () => next())
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

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`)
})

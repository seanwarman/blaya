const { readdir, access, constants } = require('fs')
const { spawn } = require('child_process')

exports.cleanDir = (req, res, next) => {
	readdir(__dirname + '/complete', (error, files) => {
		if(error) {
      console.log('@FILTER error:', error)
      return next()
    }
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

exports.copySendFile = (req, res) => {
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

exports.streamFile = (req, res) => {
	const filePath = req.params[0]
	const cp = spawn('aws', ['s3', 'cp', 's3://everest-files' + filePath, '-'])
	cp.stdout.pipe(res)
}

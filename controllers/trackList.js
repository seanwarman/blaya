import { readdir, access, constants } from 'fs'
import { spawn } from 'child_process'

export const cleanDir = (req, res, next) => {
	readdir(__dirname + '/../music', (error, files) => {
		if(error) {
      console.log('@FILTER error:', error)
      return next()
    }
		if (files.length > 3) {
			const rm = spawn('rm', ['-rf', __dirname + '/../music'])
			rm.on('error', (error) => {
				console.log(error)
			})
			rm.on('close', () => {
        const mkdir = spawn('mkdir', [__dirname + '/../music'])
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

export const copySendFile = (req, res) => {
	const filePath = req.params[0]
	access(__dirname + filePath, constants.F_OK, (err) => {
		if (!err) return res.sendFile(__dirname + filePath)
		const cp = spawn('aws', ['s3', 'cp', 's3://everest-files/music/' + filePath, __dirname + '/../music/' + filePath])
		cp.on('error', error => {
			console.log(error)
			res.send(error)
		})
		cp.on('close', () => {
			res.sendFile('/music/' + filePath, { root: __dirname + '/..' })
		})
	})
}

export const streamFile = (req, res) => {
	const filePath = req.params[0]
	const cp = spawn('aws', ['s3', 'cp', 's3://everest-files/music/' + filePath, '-'])
	cp.stdout.pipe(res)
}

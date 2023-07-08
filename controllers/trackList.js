import { readdir, access, constants } from 'fs'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseTrack, removeFromDir } from '../mover.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

function copyFromBucketToMusicDir(filePath, then) {
  const cp = spawn('aws', ['s3', 'cp', 's3://everest-files/music/' + filePath, __dirname + '/../music/' + filePath])
  cp.on('error', error => {
    console.log(error)
    res.send(error)
  })
  cp.on('close', () => {
    then(filePath)
  })
}

function mvBucketFile([from, to], then) {
  const mv = spawn('aws', ['s3', 'mv', 's3://everest-files' + from, __dirname + '/../music/' + filePath])
  mv.on('error', error => {
    console.log(error)
    then(error)
  })
  mv.on('close', code => {
    then(null, `${code}`)
  })
}

export const mvFile = (req, res) => {
	const filePath = req.params[0]
  copyFromBucketToMusicDir(filePath, async () => {
    // Get file's meta data, then do an aws mv
    const trackpath = await parseTrack(__dirname + '/../music', filePath)
    mvBucketFile(['/music/' + filePath, '/music/' + trackpath], (error, code) => {
      if (error) res.status(400).send()
      res.send(code)
    })
  })
}

export const copySendFile = (req, res) => {
	const filePath = req.params[0]
	access(__dirname + filePath, constants.F_OK, (err) => {
		if (!err) return res.sendFile(__dirname + filePath)
    copyFromBucketToMusicDir(filePath, () => {
      res.sendFile('/music/' + filePath, { root: __dirname + '/..' })
    })
	})
}

export const streamFile = (req, res) => {
	const filePath = req.params[0]
	const cp = spawn('aws', ['s3', 'cp', 's3://everest-files/music/' + filePath, '-'])
	cp.stdout.pipe(res)
}

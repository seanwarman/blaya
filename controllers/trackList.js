import { GetObjectCommand } from '@aws-sdk/client-s3'
import { readdir, access, constants } from 'fs'
import { spawn } from 'child_process'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { parseTrack, removeFromDir } from '../mover.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const rmDir = (req, res, next) => {
  const rm = spawn('rm', ['-rf', __dirname + '/../music'])
  rm.on('error', (error) => {
    console.log(error)
    res.sendStatus(500)
  })
  rm.on('close', () => {
    const mkdir = spawn('mkdir', [__dirname + '/../music'])
    mkdir.on('error', (error) => {
      console.log(error)
      res.sendStatus(500)
    })
    mkdir.on('close', () => next())
	})
}

export const cleanDir = dir => (req, res, next) => {
	readdir(dir, (error, files) => {
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
  cp.stderr.on('data', data => {
    console.log(`${data}`)
  })
  cp.stdout.on('data', data => {
    console.log(`${data}`)
  })
  cp.on('error', error => {
    console.log(error)
    res.send(error)
  })
  cp.on('close', () => {
    then(filePath)
  })
}

function mvBucketFile([from, to], then) {
  const mv = spawn('aws', ['s3', 'mv', 's3://everest-files' + from, 's3://everest-files' + to])
  mv.stderr.on('data', data => {
    console.log(`${data}`)
  });
  mv.stdout.on('data', data => {
    console.log(`${data}`)
  });
  mv.on('error', error => {
    mv.kill()
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
    try {
      // Get file's meta data, then do an aws mv
      const trackpath = await parseTrack(__dirname + '/../music', filePath)
      mvBucketFile(['/music/' + filePath, '/music/' + trackpath], (error, code) => {
        if (error) res.sendStatus(500)
        res.sendStatus(200)
      })
    } catch (error) {
      console.log(`@FILTER error:`, error)
      res.sendStatus(500)
    }
  })
}

export const downloadFile = async (req, res) => {
  const { s3 } = req.context
	const filePath = req.params[0]
  const { range } = req.headers

  try {
    const command = new GetObjectCommand({
      Bucket: 'everest-files',
      Key: 'music/' + filePath,
      Range: range,
    })
    const {
      AcceptRanges,
      ContentLength,
      ContentType,
      ContentRange,
      Body,
    } = await s3.send(command)
    res.writeHead(206, {
      'Accept-Ranges': AcceptRanges,
      'Content-Length': ContentLength,
      'Content-Type': ContentType,
      'Content-Range': ContentRange,
    })
    Body.on('data', chunk => {
      res.write(chunk)
    })
    Body.on('end', () => {
      res.status(200).end()
    })
  } catch (error) {
    console.log(`S3 read error: `, error)
    res.status(500).send(error.message)
  }
}

export const streamFile = async (req, res) => {
  const { s3 } = req.context
	const filePath = req.params[0]
  const { range } = req.headers
  try {
    const command = new GetObjectCommand({
      Bucket: 'everest-files',
      Key: 'music/' + filePath,
      Range: range,
    })
    const {
      AcceptRanges,
      ContentLength,
      ContentType,
      ContentRange,
      Body,
    } = await s3.send(command)
    res.writeHead(206, {
      'Accept-Ranges': AcceptRanges,
      'Content-Length': ContentLength,
      'Content-Type': ContentType,
      'Content-Range': ContentRange,
    })
    Body.on('data', chunk => {
      res.write(chunk)
    })
    Body.on('end', () => {
      res.status(200).end()
    })
    Body.on('error', (error) => {
      console.log(`S3 read error: `, error)
      res.status(500).send(error.message)
    })
  } catch (error) {
    console.log(`S3 read error: `, error)
    res.status(500).send(error.message)
  }
}

import { GetObjectCommand } from '@aws-sdk/client-s3'
import { readdir, createReadStream, createWriteStream } from 'fs'
import { spawn } from 'child_process'
import ffmpeg from 'fluent-ffmpeg'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { parseTrack } from '../mover.mjs'

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

export const loadTrackPackets = async (req, res) => {
  const { s3 } = req.context
	const filePath = req.params[0]
  try {
    const command = new GetObjectCommand({
      Bucket: 'everest-files',
      Key: 'music/' + filePath,
      Range: 'bytes=0-',
    });

    const { Body: readStream } = await s3.send(command);

    const process = spawn('ffprobe', [
      '-v', 'quiet', '-of', 'json', '-show_entries', 'packet=pos,pts_time', '-hide_banner', '-',
    ]);
    readStream.on('data', (data) => {
      process.stdin.write(data);
    });
    readStream.on('close', (code) => {
      if (code !== 0) {
        console.log(`s3 process exited with code ${code}`);
      }
      process.stdin.end();
    });
    let chunks = '';
    process.stdout.on('data', (data) => {
      chunks += data;
    });
    process.stderr.on('data', (data) => {
      console.error(`process stderr: ${data}`);
      chunks += data;
    });
    process.on('close', (code) => {
      if (code !== 0) {
        console.log(`ffprobe process exited with code ${code}`);
      }
      res.send(chunks);
    }); 

  } catch (error) {
    console.log(`S3 read error: `, error)
    res.status(500).send(error.message)
  }
};

export const loadTrack = async (req, res) => {
  let count = 0;
  const { s3 } = req.context
	const filePath = req.params[0]
  const { range } = req.headers

  try {
    const command = new GetObjectCommand({
      Bucket: 'everest-files',
      Key: 'music/' + filePath.replace('.dat', '.mp3'),
      Range: range || 'bytes=0-',
    });

    const {
      AcceptRanges,
      ContentLength,
      ContentType,
      ContentRange,
      Body: readStream,
    } = await s3.send(command)
    res.writeHead(200, {
      'Content-Type': 'application/json',
    });

    const process = spawn('audiowaveform', [
      '--input-format', 'mp3', '--output-format', 'dat', '-b', '8', '>'
    ]);
    // cat Black-Mountain.mp3 | audiowaveform --input-format mp3 --output-format json > thingy.json

    readStream.on('data', (data) => {
      process.stdin.write(data);
    });
    readStream.on('close', (code) => {
      if (code !== 0) {
        console.log(`s3 process exited with code ${code}`);
      }
      process.stdin.end();
    });
    let chunks = [];
    process.stdout.on('data', (data) => {
      res.write(data);
    });
    process.stderr.on('data', (data) => {
      console.error(`process stderr: ${data}`);
    });
    process.on('close', (code) => {
      if (code !== 0) {
        console.log(`audiowaveform process exited with code ${code}`);
      }
      res.status(200).end();
    }); 

  } catch (error) {
    console.log(`S3 read error: `, error)
    res.status(500).send(error.message)
  }
}

export const loadTrack_ = async (req, res) => {
  let count = 0;
  const { s3 } = req.context
	const filePath = req.params[0]
  const { range } = req.headers

  try {
    const command = new GetObjectCommand({
      Bucket: 'everest-files',
      Key: 'music/' + filePath,
      Range: range || 'bytes=0-',
    });

    const {
      AcceptRanges,
      ContentLength,
      ContentType,
      ContentRange,
      Body: readStream,
    } = await s3.send(command)
    res.writeHead(200, {
      'Accept-Ranges': AcceptRanges,
      // This causes wavesurefer to crash because the content length will be
      // slightely different when it's converted by ffmpeg...
      // 'Content-Length': ContentLength,
      'Content-Type': ContentType,
      'Content-Range': ContentRange,
    })

    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    // **** Get the waveform loading faster ****
    //
    // - Install `audiowaveform` (https://github.com/bbc/peaks.js/tree/master?tab=readme-ov-file#generating-waveform-data)
    // - Have this endpoint create waveform data .dat instead from the original mp3 (no conversion)
    // - Only load the visual waveform data of the file
    // - If it gets the times in the segments right, we don't need it to play any sound
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //
    //

    const process = spawn('ffmpeg', [
       // pipe in     
      '-i', 'pipe:0',
      // no video 
      '-vn',
      // not sure what this does...
      // https://superuser.com/questions/552817/fastest-way-to-convert-any-audio-file-to-low-bitrate
      '-map', '0:a:0',
      // audio bitrate
      '-b:a', '16k',
      // make it mono  
      '-ac', '1',
      // format mp3     
      '-f', 'mp3',  
      // pipe out
      'pipe:1',
    ]);
    readStream.on('data', (data) => {
      process.stdin.write(data);
    });
    readStream.on('close', (code) => {
      if (code !== 0) {
        console.log(`s3 process exited with code ${code}`);
      }
      process.stdin.end();
    });
    let chunks = [];
    process.stdout.on('data', (data) => {
      res.write(data);
    });
    process.stderr.on('data', (data) => {
      console.error(`process stderr: ${data}`);
    });
    process.on('close', (code) => {
      if (code !== 0) {
        console.log(`ffmpeg process exited with code ${code}`);
      }
      res.status(200).end();
    }); 

  } catch (error) {
    console.log(`S3 read error: `, error)
    res.status(500).send(error.message)
  }
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
    res.writeHead(200, {
      'Accept-Ranges': AcceptRanges,
      'Content-Length': ContentLength,
      'Content-Type': ContentType,
      ...(ContentRange ? { 'Content-Range': ContentRange } : {}),
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

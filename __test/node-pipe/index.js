import { GetObjectCommand } from '@aws-sdk/client-s3'
import Stream from 'stream';
import { spawn } from 'child_process';
import fs from 'fs';
import FFmpeg from 'fluent-ffmpeg'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const path = url => dirname(fileURLToPath(import.meta.url)) + '/' + url;

function parseFfprobeOutput(out) {
  var lines = out.split(/\r\n|\r|\n/);

  lines = lines.filter(function (line) {
    return line.length > 0;
  });

  var data = {
    streams: [],
    format: {},
    chapters: []
  };

  function parseBlock(name) {
    var data = {};

    var line = lines.shift();
    while (typeof line !== 'undefined') {
      if (line.toLowerCase() == '[/'+name+']') {
        return data;
      } else if (line.match(/^\[/)) {
        line = lines.shift();
        continue;
      }

      var kv = line.match(/^([^=]+)=(.*)$/);
      if (kv) {
        if (!(kv[1].match(/^TAG:/)) && kv[2].match(/^[0-9]+(\.[0-9]+)?$/)) {
          data[kv[1]] = Number(kv[2]);
        } else {
          data[kv[1]] = kv[2];
        }
      }

      line = lines.shift();
    }

    return data;
  }

  var line = lines.shift();
  while (typeof line !== 'undefined') {
    if (line.match(/^\[stream/i)) {
      var stream = parseBlock('stream');
      data.streams.push(stream);
    } else if (line.match(/^\[chapter/i)) {
      var chapter = parseBlock('chapter');
      data.chapters.push(chapter);
    } else if (line.toLowerCase() === '[format]') {
      data.format = parseBlock('format');
    }

    line = lines.shift();
  }

  return data;
}

export function pipeFFmpeg(req, res) {
  const readStream = fs.createReadStream(path('../../public/track.mp3'));
  const command = new FFmpeg({ source: readStream });
  command.audioBitrate(128)
    .fromFormat('mp3')
    .toFormat('wav')
    .writeToStream(res, { end: true });
}

function createTransformStream(child) {
  const stream = new Stream.Transform({
    transform(chunk, encoding, callback) {
      if (child.stdin.write(chunk, encoding)) {
	      process.nextTick(callback);
      } else {
        child.stdin.once('drain', callback);
      }
    },
    flush(callback) {
      child.stdin.end();
      if (child.stdout.destroyed) callback();
      else child.stdout.on('close', () => callback());
    },
  });
  stream.on('error', (e) => {
    console.log(`@FILTER e:`, e)
    stream.destroy(e);
  });
  child.stdin.on('error', (e) => {
    if (e.code === 'EPIPE') {
      // finished before reading the file finished (i.e. head)
      stream.emit('end');
    } else {
      stream.destroy(e);
    }
  });
  child.stdout
    .on('data', (data) => stream.push(data))
    .on('error', (e) => stream.destroy(e));
  child.stderr
    .on('data', (data) => stream.destroy(new Error(data.toString())))
    .on('error', (e) => stream.destroy(e));
  return stream;
}

export function pipeFFprobe(req, res) {
  const process = spawn('ffprobe', ['-of', 'json', '-show_entries', 'packet=pos,pts_time', '-hide_banner', '-i', path('../../public/track.mp3')]);
  let chunks = '';
  process.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
    chunks += data
  });
  process.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    chunks += data
  });
  process.on('close', (code) => {
    console.log(`child process exited with code ${code}`);
    res.send(chunks);
  }); 
}

// THIS IS IT!!!!
export function pipe(req, res) {
  const readStream = fs.createReadStream(path('../../public/track.mp3'));
  const process = spawn('ffprobe', ['-of', 'json', '-show_entries', 'packet=pos,pts_time', '-hide_banner', '-']);
  readStream.on('data', (data) => {
    process.stdin.write(data);
  });
  readStream.on('close', (code) => {
    if (code !== 0) {
      console.log(`cat process exited with code ${code}`);
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
      console.log(`awk process exited with code ${code}`);
    }
    res.send(chunks);
  }); 
}

export function pipeCatFFprobe(req, res) {
  // cat file.mp3 | grep ssh
  const cat = spawn('cat', [path('../../public/track.mp3')]);
  // const process = spawn('awk', ['{print}']);
  const process = spawn('ffprobe', ['-of', 'json', '-show_entries', 'packet=pos,pts_time', '-hide_banner', '-']);
  cat.stdout.on('data', (data) => {
    process.stdin.write(data);
  });
  cat.stderr.on('data', (data) => {
    console.error(`cat stderr: ${data}`);
  });
  cat.on('close', (code) => {
    if (code !== 0) {
      console.log(`cat process exited with code ${code}`);
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
      console.log(`awk process exited with code ${code}`);
    }
    res.send(chunks);
  }); 
}

export function pipeFromFile(req, res) {
  const readStream = fs.createReadStream(path('../../public/track.mp3'));
  readStream
    .pipe(res);
}

export async function pipeFromS3(req, res) {
  const { s3 } = req.context
  const command = new GetObjectCommand({
    Bucket: 'everest-files',
    Key: 'music/A Tribe Called Quest - Midnight Marauders - 1993/03 - Award Tour (ft Trugoy The Dove) (Prod. A Tribe Called Quest).mp3',
    Range: 'bytes=0-',
  });
  const { Body: readStream } = await s3.send(command)
  readStream.pipe(res);
}

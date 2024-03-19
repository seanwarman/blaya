import { spawn } from 'child_process'
import { dirname } from 'path'
import { fileURLToPath } from 'url'
import multer from 'multer';
import {
  downloadFile,
  streamFile,
  cleanDir,
  mvFile,
  rmDir,
  loadTrack,
  loadTrackPackets,
} from './controllers/trackList.js';
import { copy } from './mover.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'workspace/'),
    filename: (req, file, cb) => cb(null, file.originalname),
  })
})

export default app => {
  app.get('/music/*', streamFile)
  app.get('/packets/music/*', loadTrackPackets);
  app.get('/load-track/music/*', loadTrack)
  app.get('/download/music/*', downloadFile)
  app.get('/api/mv/*', rmDir, mvFile)
  app.post('/api/upload', cleanDir(__dirname + '/workspace'), upload.array('files'), (req, res) => {
    const { files } = req
    copy(0, files.map(({ originalname }) => originalname), () => {
      res.send('Uploaded')
    })
  }),
  app.get('/api/refresh', (req, res) => {
    const script = spawn('./ls_s3.sh')
    script.on('close', () => {
      res.send('Ok')
    })
    script.on('error', error => {
      res.status(404).send(error)
    })
  })
}

import { spawn } from 'child_process'
import multer from 'multer'
import { cleanDir, copySendFile, mvFile } from './controllers/trackList.js'
import { gitPullOrigin } from './controllers/update.js'
import { copy } from './mover.mjs'

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'workspace/'),
    filename: (req, file, cb) => cb(null, file.originalname),
  })
})

export default app => {
  app.get('/api/update', gitPullOrigin)
  app.get('/music/*', cleanDir, copySendFile)
  app.get('/api/mv/*', rmDir, mvFile)
  app.post('/api/upload', cleanDir, upload.array('files'), (req, res) => {
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

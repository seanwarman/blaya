import { spawn } from 'child_process'
import multer from 'multer'
import { cleanDir, copySendFile } from './controllers/trackList.js'
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
  app.post('/upload', cleanDir, upload.array('files'), (req, res) => {
    const { files } = req
    console.log(`@FILTER files:`, files)
    console.log(`@FILTER copy:`, copy)
    copy(0, files.map(({ originalname }) => originalname), () => {
      console.log('Refreshing track list...')

      const script = spawn('./ls_s3.sh')

      script.on('close', () => {
        console.log(`@FILTER Tracks refreshed`)
        res.send('Uploaded')
      })
    })
  })
}

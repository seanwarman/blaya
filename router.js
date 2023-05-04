import multer from 'multer'
import { cleanDir, copySendFile } from './controllers/trackList.js'
import { gitPullOrigin } from './controllers/update.js'
import { copy } from './mover.mjs'
const upload = multer({ dest: 'workspace/' })

export default app => {
  app.get('/api/update', gitPullOrigin)
  app.get('/music/*', cleanDir, copySendFile)
  app.post('/upload', cleanDir, upload.array('files'), (req, res) => {
    const { body, files } = req
    console.log(`@FILTER files:`, files)
    console.log(`@FILTER copy:`, copy)
    // copy(0, files.map(({ filename }) => filename))
    res.send('Upload ok')
  })
}

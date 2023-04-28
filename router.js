const { cleanDir, copySendFile } = require('./controllers/trackList.js')
const { gitPullOrigin } = require('./controllers/update.js')

module.exports = app => {
  app.get('/api/update', gitPullOrigin)
  app.get('/music/*', cleanDir, copySendFile)
}

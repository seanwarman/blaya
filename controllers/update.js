const { spawn } = require('child_process')

exports.gitPullOrigin = (req, res) => {
  const git = spawn('npm', ['run', 'update'])
  let output = ''
  git.on('error', e => {
    res.status(500).send(e)
  })
  git.stdout.on('data', data => {
    output += data.toString()
  })
  git.on('close', () => {
    res.send(output)
  })
}

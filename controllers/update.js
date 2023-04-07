const { spawn } = require('child_process')

exports.gitPullOrigin = (req, res) => {
  const git = spawn('git', ['pull', 'origin', 'master'])
  let output = ''
  git.on('error', e => {
    res.status(500).send(e)
  })
  git.stdout.on('data', data => {
    output += data.toString()
  })
  git.on('close', () => {
    if (/Already up to date/.test(output)) {
      res.send(output)
    } else {
      // npm install, then reload
      // good idea?
      res.send(output)
    }
  })
}

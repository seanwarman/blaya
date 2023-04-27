import { spawn } from 'child_process'
import { dirlist } from './public/dir-list.js'
import { parseFile } from 'music-metadata'
import { readdir } from 'node:fs/promises';

const bucket = 's3://everest-files/'
const local = 'workspace/'

function copy(i = 0) {
  const dir = dirlist[i]
  console.log(`@FILTER dir:`, dir)
  const cp = spawn('aws', ['s3', 'cp', '--recursive', bucket + 'complete/' + dir, local + dir])

  cp.stdout.on('data', d => {
    console.log(`@FILTER d.toString():`, d.toString())
  })

  cp.on('exit', () => {
    console.log(`@FILTER exit called`)
  })

  cp.on('close', () => {
    console.log(`@FILTER copied: `, dir)
    readDir(i)
  })
}

async function readDir(i) {
  const dir = dirlist[i]
  console.log(`@FILTER dir:`, dir)

  try {
    const files = await readdir(local + dir)
    if (!files.length) {
      console.log(`@FILTER no files for dir: `, dir)
      // next dir
      remove(() => copy(i + 1))
      return
    }

    mover(i, 0, files)

  } catch (e) {
    console.log(`@FILTER readDir error:`, e)
    // next dir
    // copy(i + 1)
  }
}

function remove(then) {
  const rm = spawn('rm', ['-rf', 'workspace'])
  rm.on('close', () => {
    const mkdir = spawn('mkdir', ['workspace'])
    mkdir.on('close', then)
  })
}

async function mover(dirI, i = 0, files) {
  const dir = dirlist[dirI]
  const file = files[i]
  try {
    const { common } = await parseFile(local + dir + file)
    const { title, year, album, artist } = common

    const mv = spawn('aws', ['s3', 'mv', bucket + 'complete/' + dir + file,
      bucket + 'music/' + artist + ' - ' + album + ' - ' + year + '/' + title + '.mp3'
    ])

    mv.on('error', e => {
      console.log(`@FILTER mv error:`, e)
    })
    mv.on('close', () => {
      console.log(`@FILTER file:`, file)
      console.log(`@FILTER title:`, title)
      if (files[i + 1]) {
        mover(dirI, i + 1, files)
      } else {
        // next dir
        copy(dirI + 1)
      }
    })
  } catch (error) {
    console.log(`@FILTER parseFile error:`, error)
    // next dir
    // copy(dirI + 1)
    if (files[i + 1]) {
      console.log(`@FILTER next file...`)
      mover(dirI, i + 1, files)
    } else if (dirlist[dirI + 1]) {
      console.log(`@FILTER next dir`)
      // next dir
      remove(() => copy(dirI + 1))
    } else {
      console.log(`@FILTER can't move on (shrug)`)
      console.log(`@FILTER dirI:`, dirI)
    }
  }
}

copy(0)

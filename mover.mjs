import { spawn } from 'child_process'
import { parseFile } from 'music-metadata'
import { tracklist } from './track-list.js'

const bucket = 's3://everest-files/'
const local = 'workspace/'

function copy(i = 0) {
  const file = tracklist[i]
  console.log(`@FILTER file:`, file)
  const cp = spawn('aws', ['s3', 'cp', bucket + file, local + file])

  cp.stdout.on('data', d => {
    console.log(`@FILTER d.toString():`, d.toString())
  })

  cp.on('exit', () => {
    console.log(`@FILTER exit called`)
  })

  cp.on('close', () => {
    console.log(`@FILTER copied: `, file)
    parser(i)
  })
}

function remove(then) {
  then()
  // const rm = spawn('rm', ['-rf', 'workspace'])
  // rm.on('close', () => {
  //   const mkdir = spawn('mkdir', ['workspace'])
  //   mkdir.on('close', then)
  // })
}

function newPath({ artist, album, year, title, file }) {
  if (artist && album && year && title) return bucket + 'music/' + artist + ' - ' + album + ' - ' + year + '/' + title + '.mp3'
  if (artist && album && title) return bucket + 'music/' + artist + ' - ' + album + '/' + title + '.mp3'
  if (artist && title) return bucket + 'music/' + artist +  '/' + title + '.mp3'
  if (artist) return bucket + 'music/' + artist +  '/' + file.slice(8)
  return bucket + 'music/' + file.slice(8)
}

async function parser(i) {
  const file = tracklist[i]
  try {
    const { common } = await parseFile(local + file)
    const { title, year, album, artist } = common
    console.log(`title:`, title)
    console.log(`year:`, year)
    console.log(`album:`, album)
    console.log(`artist:`, artist)

    const mv = spawn('aws', ['s3', 'mv', bucket + file,
      newPath({ title, album, artist, year, file })
    ])

    mv.on('error', e => {
      console.log(`mv error:`, e)
    })
    mv.on('close', () => {
      console.log(`Copy completed!`)
      console.log(`file:`, file)
      console.log(`title:`, title)

      remove(() => copy(i + 1))
    })

  } catch (error) {
    console.log(`Parsing error: `, error)
    copy(i + 1)
  }
}

copy(0)

import { spawn } from 'child_process'
import { parseFile } from 'music-metadata'

const bucket = 's3://everest-files/'
const local = 'workspace/'

export function copy(i = 0, tracklist, then) {
  const file = tracklist[i]
  if (!file) return then(tracklist)
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
    parser(i, tracklist, then)
  })
}

function remove(then) {
  const rm = spawn('rm', ['-rf', 'workspace'])
  rm.on('close', () => {
    const mkdir = spawn('mkdir', ['workspace'])
    mkdir.on('close', then)
  })
}

function newPath({ track, artist, album, year, title }) {
  let trackNo = track?.no?.toString() || ''
  if (trackNo.length === 1) trackNo = '0' + trackNo
  let trackNoAndTitle = title
  if (trackNo.length) trackNoAndTitle = trackNo + ' - ' + title

  if (artist && album && year && trackNoAndTitle) return bucket + 'music/' + artist + ' - ' + album + ' - ' + year + '/' + trackNoAndTitle
  if (artist && album && trackNoAndTitle) return bucket + 'music/' + artist + ' - ' + album + '/' + trackNoAndTitle
  if (artist && trackNoAndTitle) return bucket + 'music/' + artist +  '/' + trackNoAndTitle
  return bucket + 'music/' + trackNoAndTitle
}

async function parser(i, tracklist, then) {
  const file = tracklist[i]
  try {
    const { common } = await parseFile(local + file)
    const { track, title, year, album, artist } = common
    console.log(`track?.no:`, track?.no)
    console.log(`title:`, title)
    console.log(`year:`, year)
    console.log(`album:`, album)
    console.log(`artist:`, artist)

    const cp = spawn('aws', ['s3', 'cp', local + file,
      newPath({ track, album, artist, year, title: title || file.slice(0, -4) })
    ])

    cp.on('error', e => {
      console.log(`cp error:`, e)
    })
    cp.on('close', () => {
      console.log(`Copy completed!`)
      console.log(`file:`, file)
      console.log(`title:`, title)

      remove(() => copy(i + 1, tracklist, then))
    })

  } catch (error) {
    console.log(`Parsing error: `, error)
    copy(i + 1, tracklist, then)
  }
}

// copy(0, tracklist)

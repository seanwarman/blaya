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

export function removeFromDir(dir, then) {
  const rm = spawn('rm', ['-rf', dir])
  rm.on('close', () => {
    const mkdir = spawn('mkdir', [dir])
    mkdir.on('close', then)
  })
}

function remove(then) {
  removeFromDir('workspace', then)
}

function newPath({ track, artist, album, year, title }) {
  let trackNo = track?.no?.toString() || ''
  if (trackNo.length === 1) trackNo = '0' + trackNo
  let trackNoAndTitle = title
  if (trackNo.length) trackNoAndTitle = trackNo + ' - ' + title

  if (artist && album && year && trackNoAndTitle) return bucket + 'music/' + artist + ' - ' + album + ' - ' + year + '/' + trackNoAndTitle + '.mp3'
  if (artist && album && trackNoAndTitle) return bucket + 'music/' + artist + ' - ' + album + '/' + trackNoAndTitle + '.mp3'
  if (artist && trackNoAndTitle) return bucket + 'music/' + artist +  '/' + trackNoAndTitle + '.mp3'
  return bucket + 'music/' + trackNoAndTitle + '.mp3'
}

export async function parseTrack(local, file) {
  try {
    const { common } = await parseFile(local + '/' + file)
    const { track, title, year, album, artist } = common
    console.log(`track?.no:`, track?.no)
    console.log(`title:`, title)
    console.log(`year:`, year)
    console.log(`album:`, album)
    console.log(`artist:`, artist)

    return newPath({ track, album, artist, year, title: title || file.slice(0, -4) })
  } catch (error) {
    throw error
  }
}

export async function parser(i, tracklist, then) {
  const file = tracklist[i]
  try {
    const trackpath = await parseTrack(local, file)

    const cp = spawn('aws', ['s3', 'cp', local + file, trackpath])

    cp.on('error', e => {
      console.log(`cp error:`, e)
    })
    cp.on('close', () => {
      console.log(`Copy completed!`)
      console.log(`file:`, file)
      console.log(`title:`, title)

      if (!tracklist[i+1]) return remove(then)
      copy(i + 1, tracklist, then)
    })

  } catch (error) {
    console.log(`Parsing error: `, error)
    if (!tracklist[i+1]) return remove(then)
    copy(i + 1, tracklist, then)
  }
}

// copy(0, tracklist)

let payload = {};

addEventListener('message', e => {
  console.log(`@FILTER e:`, e)
  const { data } = e;
  const { type } = data;
  if (type === 'START') {
    payload = data.payload;
    clock();
  }
})


// CLOCK
function clock() {
  let {
    // stop,
    count,
    source,
    clockTime,
    STEP_RESOLUTION,
    eventLoop,
  } = payload;

  count++
  if (count === 1) {
    console.log(`=======================================================================================`)
    // click(0)
  }
  if (count % 16 === 0) {
    console.log(`---------------------${count / 16}---------------------`)
    // setTimeline(1)
  }
  if (count === STEP_RESOLUTION) {
    count = 0
  }
  // const source = eventLoop(0, 0, clockTime)
  // stop.addEventListener('click', () => {
  //   source.removeEventListener('ended', clock)
  //   source.stop()
  //   start.disabled = false
  //   count = 0
  // })
  source.addEventListener('ended', clock)
}


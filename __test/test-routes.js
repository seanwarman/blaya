import { pipe } from './node-pipe/index.js'

export default app => {
  app.get('/__test/node-pipe', pipe);
}

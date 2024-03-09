import * as dom from '../helpers/dom.js'

const id = 'router-container';

export default function Router() {
  const container = document.getElementById(id);
  container.replaceWith(dom.div({
    id,
    children: [
      dom.link({
        href: '/elements/Router.css',
        rel: 'stylesheet',
      }),
      dom.div({
        id: 'router',
      }),
    ],
  }));
}

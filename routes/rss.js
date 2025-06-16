import axios from 'axios';
import * as cheerio from 'cheerio';
import RSS from 'rss';

export default app => {
  app.get('/rss/thesymbolicworld', async (req, res) => {
 
    const { data: html } = await axios.get('https://www.thesymbolicworld.com/content-categories/articles', { responseType: 'text' });
    const $ = cheerio.load(html);

    const $titleEls = $('h3[fs-cmsfilter-field="title"].content-heading-2.articles');
    const titles = $titleEls.map((_, el) => $(el).text()).get();
    const descriptions = $titleEls.map((_, el) => $(el).next().text()).get();
    const images = $titleEls.map((_, el) => $(el).parent().prev().find('img:first-of-type').attr('src')).get();
    const urls = $titleEls.map((_, el) => $(el).parent().parent().parent().attr('href')).get();

    const feed = new RSS({
      title: 'The Symbolic World',
      feed_url: 'https://myserve.org/rss/thesymbolicworld',
      site_url: 'https://www.thesymbolicworld.com',
    });

    titles.forEach((title, i) => {
      feed.item({
        title,
        description: descriptions[i],
        url: 'https://www.thesymbolicworld.com' + urls[i],
        enclosure: {
          url: images[i],
          type: 'image/jpeg',
        },
      });
    })

    res.send(feed.xml({ indent: true }));


    // const feed = new RSS(feedOptions);
  });
};

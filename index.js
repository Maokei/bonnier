const express = require('express');
const app = express();
const axios = require('axios');
let Parser = require('rss-parser');

const router = require('./router');

const rawFeeds = require('./data/feeds.json')

const port = process.env.SERVER_PORT | 3000;
app.use(express.json());

const rssData = [];

console.log(rawFeeds);


let parser = new Parser()


let rssItems = [];
const rssMap = new Map() //<string rss ,object>

const getFeeds = async (url) => {
  return await parser.parseURL(url);
}

const getAllFeeds = async () => {
  for(let feed of rawFeeds.feeds) {
    const rss = await getFeeds(feed);
    rssItems.push(...rss.items);
  }
  const sorted = rssItems.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));

  const sliced = sorted.slice(0, 10);
  rssItems = sliced;
  console.log(sliced);

}

app.get('/', async (req, res) => {
  await getAllFeeds();
  res.send(rssItems.map((item) => ({title: item.title, link: item.link})));
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})

app.use('/router', router);

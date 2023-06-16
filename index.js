const express = require('express');
const app = express();
let Parser = require('rss-parser');
const router = require('./router');
const rawFeeds = require('./data/feeds.json')

const port = process.env.SERVER_PORT || 3000;
app.use(express.json());
let parser = new Parser()

const getAllFeeds = async () => {
  // Fetch all rss feeds, extract feed items lists and flatten them to one
  const feedItems = (await Promise.all(rawFeeds.feeds.map(feedUrl => parser.parseURL(feedUrl))) // url to promises, Allow promises to resolve together
  .then(rssFeedRes => rssFeedRes.map(f => f.items))).flat(); // handle results from above requests, map out rss feed items to only lists of items flattn all lists together
  // Sorting on date and time
  const sortedItems = feedItems.sort((a, b) => new Date(b.isoDate) - new Date(a.isoDate));
  // Filter all rss items on title to remove duplicates
  const uniqueItems = sortedItems.filter(
    (obj, index) =>
      sortedItems.findIndex((item) => item.title === obj.title) === index
  );
  // take out top 10 items
  return uniqueItems.slice(0, 10);
}

app.get('/', async (req, res) => {
  const items = await getAllFeeds();
  // map items to obj {title, link} return list
  res.send(items.map((item) => ({title: item.title, link: item.link})));
})

app.listen(port, () => {
  console.log(`Server listening on port ${port} ,feeds: ${rawFeeds.feeds.length}`);
})

app.use('/router', router);

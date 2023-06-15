const express = require('express');
const router = express.Router();

// middleware that is specific to this router
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('Router home')
})
// define the about route
router.get('/data', (req, res) => {
  res.send('RSS')
})

module.exports = router;

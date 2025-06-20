var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dogPic', async(req, res, next) => {
  res.set('Content-Type', 'application/json');

  try {
    let response = await fetch('https://dog.ceo/api/breeds/image/random');
    let data = await response.json();
    res.json()
  } catch (error) {
    res.status(500).json( { error: 'error fetching image' });
  }
});

module.exports = router;

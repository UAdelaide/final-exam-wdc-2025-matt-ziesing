var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dogPic', async(req, res, next) => {
  res.set('Content-Type', 'application/json');
  
})

module.exports = router;

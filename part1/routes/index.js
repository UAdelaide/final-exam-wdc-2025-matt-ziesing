var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/api/dogs', function(req, res, next) {
  req.pool.getConnection(function(err, connection) {
    if (err) {
      res.sendStatus(500);
      return;
    }

    var query = "SELECT first_name, last_name from actor";
    connection.query(query, function(error, rows, field) {
      connection.release();
      if (error) {
        res.sendStatus(500);
        return;
      }
      if (!rows || rows.length === 0) {
        res.sendStatus(404);
        return;
      }
      res.json(rows);
    });
  });
});

module.exports = router;

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mysql = require('mysql2/promise');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

let db;

(async () => {
  try {
    // Connect to MySQL without specifying a database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root'
    });

    // Create the database if it doesn't exist
    await connection.query('CREATE DATABASE IF NOT EXISTS DogWalkService');
    await connection.end();

    // Now connect to the created database
    db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      database: 'DogWalkService'
    });

    // Insert data if table is empty
    const [WalkApps] = await db.execute('SELECT COUNT(*) AS count FROM WalkApplications');
    if (WalkApps[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkApplications (request_id, walker_id, applied_at, status) VALUES
        (1, 2, '2025-04-19 11:30:00, 'accepted'),
        (3, 4, '2025-06-19 11:30:00', 'rejected'),
      `);
    }

    const [WalkRatings] = await db.execute('SELECT COUNT(*) AS count FROM WalkRatings');
    if (WalkRatings[0].count === 0) {
      await db.execute(`
        INSERT INTO WalkRatings (request_id, walker_id, owner_id, rating, comments, rated_at) VALUES
        (1, 2, 3, 5, 'Great Walker. Dog very happy.', '2025-06-10 13:00:00'),
        (3, 4, 2, 5, 'Really happy with their service', '2025-06-11 12:00:00'),
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

module.exports = app;

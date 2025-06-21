const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});

// this is the login route for users to check if they are already a signed up user
router.post('/login', async (req, res) => {
  const { user, password } = req.body;

  try {
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [user, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// this request gets the dog's that the current session owner has registered that they own
router.get('/dogs', async (req, res) => {
  const userData = req.query.user_id;

  try {
    const [rows] = await db.query(`
    SELECT name FROM Dogs
    WHERE owner_id = ?
    `, [userData]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dog names' });
  }
});

// this function gets all the dog info from the Dogs table in the database
router.get('/allDogs', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * from Dogs`);
      res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch all dog information' });
  }
});

// this route gets a random dog image from the dog.ceo API
router.get('/dogPic', async(req, res, next) => {
  res.set('Content-Type', 'application/json');

  try {
    let response = await fetch('https://dog.ceo/api/breeds/image/random');
    let data = await response.json();
    res.json({ data: data.message });
  } catch (error) {
    res.status(500).json({ error: 'error fetching image' });
  }
});

module.exports = router;
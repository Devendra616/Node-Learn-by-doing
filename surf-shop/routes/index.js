const express = require('express');
const router = express.Router();
const {postRegister} = require('../controllers/index');

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Surf Shop - Home' });
});

/* Get register */
router.get('/register', (req, res, next) => {
  res.send("GET Register")
});

/* Post register */
router.post('/register', postRegister);

/* Get LOGIN */
router.get('/login', (req, res, next) => {
  res.send("GET Login")
});

/* Post LOGIN */
router.post('/login', (req, res, next) => {
  res.send("POST Login")
});

/* Get Profile */
router.get('/profile', (req, res, next) => {
  res.send("GET Profile")
});

/* PUT /profile/:user_id */
router.put('/profile/:user_id', (req, res, next) => {
  res.send("PUT  /profile/:user_id")
});

/* Get /forgot */
router.get('/forgot', (req, res, next) => {
  res.send("GET /forgot")
});

/* PUT /forgot */
router.put('/forgot', (req, res, next) => {
  res.send("PUT  /forgot")
});

/* Get /reset/:token */
router.get('/reset/:token', (req, res, next) => {
  res.send("GET /reset/:token")
});

/* PUT /profile/:token */
router.put('/reset/:token', (req, res, next) => {
  res.send("PUT  /reset/:token")
});
module.exports = router;   

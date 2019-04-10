const express = require('express');
const router = express.Router();
const { postRegister, postLogin, getLogout, landingPage, getRegister, getLogin} = require('../controllers/index');
const { asyncErrorHandler,checkIfUserExist } = require('../middlewares/index');


/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* Get register */
router.get('/register', getRegister);

/* Post register */
router.post('/register',
            asyncErrorHandler(checkIfUserExist), 
            asyncErrorHandler(postRegister)
);

/* Get LOGIN */
router.get('/login', getLogin);

/* Post LOGIN */
router.post('/login',postLogin);

 /*Get Logout */
router.get('/logout', getLogout);

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

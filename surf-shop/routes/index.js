const express = require('express');
const router = express.Router();
const { asyncErrorHandler, isLoggedIn, isValidPassword, changePassword } = require('../middlewares/index');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });
const { 
  postRegister, 
  postLogin, 
  getLogout, 
  landingPage, 
  getRegister, 
  getLogin,
  getProfile,
  updateProfile
  } = require('../controllers/index');
//const { asyncErrorHandler,checkIfUserExist } = require('../middlewares/index');


/* GET home/landing page. */
router.get('/', asyncErrorHandler(landingPage));

/* Get register */
router.get('/register', upload.single('image'), getRegister);

/* Post register */
router.post('/register',
           // asyncErrorHandler(checkIfUserExist), 
            asyncErrorHandler(postRegister)
);

/* Get LOGIN */
router.get('/login', getLogin);

/* Post LOGIN */
router.post('/login',asyncErrorHandler(postLogin));

 /*Get Logout */
router.get('/logout', getLogout);

/* Get Profile */
router.get('/profile',isLoggedIn, asyncErrorHandler(getProfile));

/* PUT /profile/ */
router.put('/profile',
  isLoggedIn,
  upload.single('image'),
	asyncErrorHandler(isValidPassword),
	asyncErrorHandler(changePassword),
	asyncErrorHandler(updateProfile)
);

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

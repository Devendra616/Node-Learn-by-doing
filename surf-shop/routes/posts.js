const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary, storage } = require('../cloudinary');
const upload = multer({ storage });
const { asyncErrorHandler ,isLoggedIn, isAuthor} = require('../middlewares'); //index by default
const {postIndex,postNew, postCreate, postShow, postEdit, postUpdate, postDestroy} = require('../controllers/post');

/* GET posts index : /post  */
router.get('/', asyncErrorHandler(postIndex));
  
/* GET posts new : /post/new  */
router.get('/new', isLoggedIn, postNew); //errorHandler reqd for aync functions
  
/* POST posts create : /posts  */
router.post('/',isLoggedIn,upload.array('images',4),asyncErrorHandler(postCreate));
  
/* GET posts show : /post/:id  */
router.get('/:id', asyncErrorHandler(postShow));
  
/* GET posts edit : /post/:id/edit  */
router.get('/:id/edit',isLoggedIn,asyncErrorHandler(isAuthor), asyncErrorHandler(postEdit));
  
/* PUT posts update : /post/:id  */
router.put('/:id',isLoggedIn,asyncErrorHandler(isAuthor), upload.array('images',4),asyncErrorHandler(postUpdate));
  
 /* DELETE posts destroy : /post/:id  */
router.delete('/:id',isLoggedIn,asyncErrorHandler(isAuthor), asyncErrorHandler(postDestroy)); 

  module.exports = router;   
  
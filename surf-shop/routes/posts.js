const express = require('express');
const router = express.Router();
const { asyncErrorHandler } = require('../middlewares'); //index by default
const {postIndex,postNew, postCreate, postShow, postEdit, postUpdate, postDestroy} = require('../controllers/post');

/* GET posts index : /post  */
router.get('/', asyncErrorHandler(postIndex));
  
/* GET posts new : /post/new  */
router.get('/new', postNew); //errorHandler reqd for aync functions
  
/* POST posts create : /posts  */
router.post('/', asyncErrorHandler(postCreate));
  
/* GET posts show : /post/:id  */
router.get('/:id', asyncErrorHandler(postShow));
  
/* GET posts edit : /post/:id/edit  */
router.get('/:id/edit', asyncErrorHandler(postEdit));
  
/* PUT posts update : /post/:id  */
router.put('/:id', asyncErrorHandler(postUpdate));
  
 /* DELETE posts destroy : /post/:id  */
router.delete('/:id', asyncErrorHandler(postDestroy)); 

  module.exports = router;   
  
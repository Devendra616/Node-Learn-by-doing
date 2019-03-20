const express = require('express');
const router = express.Router();
const { errorHandler } = require('../middlewares'); //index by default
const {getPosts,newPost, createPost, showPost} = require('../controllers/post');

/* GET posts index : /post  */
router.get('/', errorHandler(getPosts));
  
/* GET posts new : /post/new  */
router.get('/new', newPost); //errorHandler reqd for aync functions
  
/* POST posts create : /posts  */
router.post('/', errorHandler(createPost));
  
/* GET posts show : /post/:id  */
router.get('/:id', errorHandler(showPost));
  
/* GET posts edit : /post/:id/edit  */
router.get('/:id/edit', (req, res, next) => {
    res.send("EDIT /posts/:id/edit");
  });
  
/* PUT posts update : /post/:id  */
router.put('/:id', (req, res, next) => {
    res.send("UPDATE /posts/:id");
  });
  
 /* DELETE posts destroy : /post/:id  */
router.delete('/:id', (req, res, next) => {
    res.send("DELETE /posts/:id");
  }); 

  module.exports = router;   
  
const express = require('express');
const router = express.Router();

/* GET posts index : /post  */
router.get('/', (req, res, next) => {
    res.send("INDEX /posts");
  });
  
/* GET posts new : /post/new  */
router.get('/new', (req, res, next) => {
    res.send("NEW /posts/new");
  });
  
/* POST posts create : /posts  */
router.post('/new', (req, res, next) => {
    res.send("CREATE /posts");
  });
  
/* GET posts show : /post/:id  */
router.get('/:id', (req, res, next) => {
    res.send("SHOW /posts/:id");
  });
  
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
  
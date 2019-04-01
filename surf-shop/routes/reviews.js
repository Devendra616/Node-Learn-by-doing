const express = require('express');
//configuration object mergeParams allows to access :id of  /posts/:id/ defined in app.js .Preserve the req.params values from the parent router.
const router = express.Router({ mergeParams:true });
const {asyncErrorHandler, isReviewAuthor} = require('../middlewares');
const {
  reviewCreate,
  reviewUpdate,
  reviewDestroy
} = require('../controllers/reviews');

 
/* post reviews create : /posts/:id/reviews  */
router.post('/', asyncErrorHandler(reviewCreate));  
 
/* PUT reviews update : /posts/:id/reviews/:review_id  */
router.put('/:review_id',isReviewAuthor, asyncErrorHandler(reviewUpdate));
  
 /* DELETE reviews destroy : /posts/:id/reviews/:review_id  */
router.delete('/:review_id', (req, res, next) => {
    res.send("DELETE /posts/:id/reviews/:review_id");
  }); 

module.exports = router;   
  
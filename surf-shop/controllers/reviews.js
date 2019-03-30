const Post = require('../models/post');
const Review = require('../models/review');

module.exports= {
    //Review Create
    async reviewCreate(req,res,next){
        //find post by id
        let post= await Post.findById(req.params.id);        
        //create review
        req.body.review.author = req.user._id;
        let review = await Review.create(req.body.review);
        
        //assign review to post
        post.reviews.push(review);        
        //save post
        post.save();        
        //redirect to post
        req.session.success = "Review created Successfully!";        
        res.redirect(`/posts/${post.id}`);
    },
 
    //Review Update
    async reviewUpdate(req,res,next){

    },

    //Review Destrory
    async reviewDestroy(req,res,next){

    }
}
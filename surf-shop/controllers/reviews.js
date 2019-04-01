const Post = require('../models/post');
const Review = require('../models/review');

module.exports= {
    //Review Create
    async reviewCreate(req,res,next){
        //find post by id and get reviews
        let post= await Post.findById(req.params.id).populate('reviews').exec();
        let haveReviewed = post.reviews.filter(review=> {
            return review.author.equals(req.user._id);
        }).length;

        if(haveReviewed){
            req.session.error = 'Sorry, you can create only one review per post';
            return res.redirect(`/posts/${post.id}`);
        }
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
        await Review.findByIdAndUpdate(req.params.review_id,req.body.review);
        req.session.success = 'Review updated Successfully!';
        res.redirect(`/posts/${req.params.id}`);
    },

    //Review Destrory
    async reviewDestroy(req,res,next){
        //delete the review id from Post
        const post = await Post.findByIdAndUpdate(req.params.id,{
            $pull:{reviews: req.params.review_id}
        });        
        await Review.findByIdAndRemove(req.params.review_id);
        req.session.success = "Review removed Successfully!";
        res.redirect(`/posts/${req.params.id}`);
    }
}
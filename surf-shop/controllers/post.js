const Post = require('../models/post');

module.exports= {
    //post index
    async getPosts(req,res,next){
        let posts =  await Post.find({});
        res.render('posts/index',{posts});
    },

    //Post New
    newPost(req,res,next){
        res.render('posts/new');
    },

    //Post Create
    async createPost(req,res,next){
       let post = await Post.create(req.body);
       res.redirect(`/posts/${post.id}`);
    },

    //Post Show 
    async showPost(req,res,next){
        let post = await Post.findById(req.params.id);
        console.log(post);       
        res.render('posts/show',{post});
    }
}
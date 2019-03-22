const Post = require('../models/post');


module.exports= {
    //post index
    async postIndex(req,res,next){
        let posts =  await Post.find({});
        res.render('posts/index',{posts});
    },

    //Post New
    postNew(req,res,next){
        res.render('posts/new');
    },

    //Post Create
    async postCreate(req,res,next){
       let post = await Post.create(req.body.post);
       res.redirect(`/posts/${post.id}`);
    },

    //Post Show 
    async postShow(req,res,next){
        let post = await Post.findById(req.params.id);        
        res.render('posts/show',{post});
    },
    
    //Post Edit
    async postEdit(req,res,next){
        let post = await Post.findById(req.params.id);
        res.render('posts/edit',{post});
    },
    //Post Edit
    async postUpdate(req,res,next){
        let post = await Post.findByIdAndUpdate(req.params.id,req.body.post,{new:true});//new:true returns newly updated post instead of old one
       
        res.redirect(`/posts/${post.id}`);
    },

    //Post Destrory
    async postDestroy(req,res,next){
        await Post.findByIdAndRemove(req.params.id);
        res.redirect("/posts");
    }
}
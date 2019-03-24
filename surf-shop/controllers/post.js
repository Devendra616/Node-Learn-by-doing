const Post = require('../models/post');
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'nmdc',
    api_key:'262191713656249',
    api_secret: process.env.CLOUDINARY_SECRET
})

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
        req.body.post.images = [];
       for(const file of req.files){
          let image = await cloudinary.v2.uploader.upload(file.path);
          req.body.post.images.push({
              url: image.secure_url,
              public_id: image.public_id
          });
       }
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
    //Post Update
    async postUpdate(req,res,next){
        //handle any deletion of existing images
        //handle upload of any new images
        let post = await Post.findByIdAndUpdate(req.params.id,req.body.post,{new:true});//new:true returns newly updated post instead of old one
       
        res.redirect(`/posts/${post.id}`);
    },

    //Post Destrory
    async postDestroy(req,res,next){
        await Post.findByIdAndRemove(req.params.id);
        res.redirect("/posts");
    }
}
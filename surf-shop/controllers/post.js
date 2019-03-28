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
        // find the post by id
        let post = await Post.findById(req.params.id);
        // check if there's any images for deletion
        if(req.body.deleteImages && req.body.deleteImages.length){
            // assign deleteImages from req.body to its own variable
            
            let deleteImages = req.body.deleteImages;
             // loop over deleteImages
            for(const public_id of deleteImages){                
                // delete images from cloudinary
                await cloudinary.v2.uploader.destroy(public_id);
                
                // delete image from post.images
                for(const image of post.images) {
                    if(image.public_id === public_id) {
                        let index = post.images.indexOf(image);
                        post.images.splice(index,1);
                    }
                }
            }
        }

        // check if there are any new images for upload  
        if(req.files) {
            //upload images
            for(const file of req.files){
                let image = await cloudinary.v2.uploader.upload(file.path);
                // add images to post.images array
                post.images.push({
                    url: image.secure_url,
                    public_id: image.public_id
                });
             }
        }
        // update the post with any new properties          
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        post.location = req.body.post.location;
        // save the updated post into the db
        post.save();
        // redirect to show page               
        res.redirect(`/posts/${post.id}`);
    },

    //Post Destrory
    async postDestroy(req,res,next){
        let post = await Post.findById(req.params.id);
        for(image of post.images){
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        post.remove();
        res.redirect("/posts");
    }
}
const Post = require('../models/post');
require('dotenv').config();

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapBoxToken });
const { cloudinary } = require('../cloudinary');


module.exports= {
    //post index
    async postIndex(req,res,next){
        let posts =  await Post.paginate({},{
            page: req.query.page || 1,
            limit:10,
            sort:{'_id':-1} //sort by id desc
        });
        posts.page = Number(posts.page);
        res.render('posts/index',{posts,mapBoxToken , title:'Post Index'});
    },

    //Post New
    postNew(req,res,next){
        res.render('posts/new', {title:'Post New'});
    },

    //Post Create
    async postCreate(req,res,next){
        req.body.post.images = [];
        for(const file of req.files) {
            req.body.post.images.push({
                url: file.secure_url,
                public_id: file.public_id
            });
        }
       let response = await geocodingClient
       .forwardGeocode({
            query: req.body.post.location,
            limit: 1       
       })
       .send();
       
       req.body.post.geometry = response.body.features[0].geometry;
       req.body.post.author = req.user._id;
       console.log(req.body.post.coordinates);
       let post = new Post(req.body.post);
	   post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
	   post.save();
       req.session.success = 'Post created successfully!';
       res.redirect(`/posts/${post.id}`);
    },

    //Post Show 
    async postShow(req,res,next){        
        let post = await Post.findById(req.params.id).populate({
            path:'reviews',
            options:{sort:{'_id':-1}},  /*-ve for decending and +ve for asc */
            populate : {
                path: 'author',
                model:'User'
            }
        });        
        const floorRating = post.calculateAvgRating();
        res.render('posts/show',{post, title:post.title, mapBoxToken,floorRating});
    },
    
    //Post Edit
    async postEdit(req,res,next){       
        res.render('posts/edit');
    },

    //Post Update
    async postUpdate(req,res,next){
        // find the post , set by middleware index
        const {post} = res.locals;
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
			// upload images
			for(const file of req.files) {
				// add images to post.images array
				post.images.push({
					url: file.secure_url,
					public_id: file.public_id
				});
			}
		}
        //if location in form is different from location saved then update coordinates
        if(req.body.post.location != post.location){
            let response = await geocodingClient
            .forwardGeocode({
                 query: req.body.post.location,
                 limit: 1       
            })
            .send();
            post.location = req.body.post.location;
            post.geometry =response.body.features[0].geometry;
        }
        // update the post with any new properties          
        post.title = req.body.post.title;
        post.description = req.body.post.description;
        post.price = req.body.post.price;
        post.properties.description = `<strong><a href="/posts/${post._id}">${post.title}</a></strong><p>${post.location}</p><p>${post.description.substring(0, 20)}...</p>`;
        // save the updated post into the db
        post.save();
        // redirect to show page    
        req.session.success = 'Post updated Successfully!';
        res.redirect(`/posts/${post.id}`);
    },

    //Post Destrory
    async postDestroy(req,res,next){
        const {post} = res.locals;
        for(image of post.images){
            await cloudinary.v2.uploader.destroy(image.public_id);
        }
        await post.remove();
        req.session.success = 'Post deleted Successfully!';
        res.redirect("/posts");
    }
}
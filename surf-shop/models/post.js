const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');
const mongoosePaginate = require('mongoose-paginate');

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,  
    images:[{url:String, public_id:String}], //url allows to display file correctly on view, pubicid for refering to image on cloud and search,delete etc
    location: String,
    geometry:{
        type:{
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type:[Number],
            required:true
        }
    },
    properties:{
        description: String
    },   
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    avgRating: {type: Number, default:0  }
});

PostSchema.pre('remove', async function(){
    await Review.remove({
        _id: {
            $in: this.reviews
        }
    });
});

//instance method
PostSchema.methods.calculateAvgRating = function() {
    let ratingsTotal = 0;
    if(this.reviews.length){
        this.reviews.forEach((review)=>{
            ratingsTotal += review.rating;
        });
        this.avgRating = Math.round((ratingsTotal/this.reviews.length)*10)/10;
    }else{
        this.avgRating = ratingsTotal; //0
    }
    
    const floorRating = Math.floor(this.avgRating);
    this.save(); //save post to db
    return floorRating;
}

PostSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Post', PostSchema);

/*
Post
- title - string
- price - string
- description - string
- images - array of strings
- location - string
- lat- number
- lng- number
- author - Object id ref User
- reviews - array of objects
*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: String,
    price: String,
    description: String,  
    location: String,
    lat: Number,
    lng: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

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
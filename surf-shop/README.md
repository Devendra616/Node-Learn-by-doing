# Posts Edit Form
	- update checkbox name
	- add enctype to form

# Posts Update Route
	- add upload.array()


# Posts Update Method
	- find the post by id
	- check if there's any images for deletion
		- assign deleteImages from req.body to its own variable
		- loop over deleteImages
			- delete images from cloudinary
			- delete image from post.images
	- check if there are any new images for upload
		- upload images
			- add images to post.images array
	- update the post with any new properties
	- save the updated post into the db
	- redirect to show page


# Adding Flash Messages

- Update pre-route middleware to check for error or success on the session
- Update post-route error handling middleware to console.log() the full err, then set err.message on req.session.error and redirect('back')
- Create a partial for flash messages and include it in our layouts
- Write some success messages and throw some errors to test it out

# Review Authorization
- Create a second user with cURL
- Change existing review's author to new user's id
- Add isReviewAuthor async middleware to PUT route and test it
- Add if statement to EJS

# Curl
- curl -d "username=ian&password=ian" -X POST http://localhost:3000/register
  Works like postman. -d has parameters seperated by &, -X for get/post method

# Review Delete
- Create a delete button with a form in the post show view
- Update the delete route with isReviewAuthor middleware
and reviewDestroy method
- In reviewDestroy method: 
	- Find post by id and update to pull reviews with matching review_id
	- find review by id and remove
	- flash success
	- redirect to back to post show

# Remove Referenced Reviews When a Post Gets Deleted

- Add pre('remove') hook/middleware to Post model
- Add success flash message to posts controller postDestroy method	

# Restrict One Review Per User, Per Post
- Populate reviews on post in reviewCreate method (in reviews controller)
- Filter post.reviews by author to see if logged in user has already reviewed the post
- Assign hasReviewed to filtered array's length
- If hasReviewed is true, then flash error and redirect
- Otherwise, create review, add to post.reviews, save post, flash success, and redirect

# Add 5 Star Rating Feature

- Add starability-basic.min.css to /public/stylesheets from [here](https://raw.githubusercontent.com/LunarLogic/starability/master/starability-minified/starability-basic.min.css)
	- Review [documentation](https://github.com/LunarLogic/starability) as needed
- Add link to starability-basic.min.css in post-show-layout.ejs
- Add starability syntax to review new and edit forms in post show.ejs
- Customize id's and names
- Add client script inside of .forEach loop for reviews to auto check rating in edit form

# Add Clear Rating Button to 5 Star Rating Feature

- Add a button to the new/edit review forms in /views/posts/show.ejs:
```HTML
<button class="clear-rating" type="button">Clear Rating</button>
```

- Add styling to /public/stylesheets/post-show.css
```CSS
.clear-rating {
  display: block;
}
```

- Add click listener to the clear rating button in /public/javascripts/post-show.js (selects and clicks nearest zero star rating input):
```JS
// Add click listener for clearing of rating from edit/create form
$('.clear-rating').click(function() {
	$(this).siblings('.input-no-rate').click();
});
```


# Add average rating to Post
- Add avgRating property to PostSchema (/models/post.js)
```JS
const PostSchema = new Schema({
	title: String,
	price: String,
	description: String,
	images: [ { url: String, public_id: String } ],
	location: String,
	coordinates: Array,
	author: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		{
			type: Schema.Types.ObjectId,
			ref: 'Review'
		}
	],
	avgRating: { type: Number, default: 0 }
});
```
- Add calculateAvgRating instance method to PostSchema (/models/post.js)
```JS
PostSchema.methods.calculateAvgRating = function() {
	let ratingsTotal = 0;
	this.reviews.forEach(review => {
		ratingsTotal += review.rating;
	});
	this.avgRating = Math.round((ratingsTotal / this.reviews.length) * 10) / 10;
	const floorRating = Math.floor(this.avgRating);
	this.save();
	return floorRating;
}
```
- Calculate average rating in postShow method (/controllers/posts.js)
```JS
// Posts Show
async postShow(req, res, next) {
	let post = await Post.findById(req.params.id).populate({
		path: 'reviews',
		options: { sort: { '_id': -1 } },
		populate: {
			path: 'author',
			model: 'User'
		}
	});
	const floorRating = post.calculateAvgRating();
	// the following line is not covered in a lecture
	let mapBoxToken = process.env.MAPBOX_TOKEN;
	res.render('posts/show', { post, mapBoxToken, floorRating });
},
```
- Add font-awesome CDN to post show layout (/views/layouts/post-show-layout.ejs)
```HTML
<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossorigin="anonymous">
```
- Add star rendering logic to post show view (/views/posts/show.ejs)
```HTML
<div>
<% for(var i = 0; i < 5; i++) { %>
	<% if(i < floorRating) { %>
    <i class="fas fa-star"></i>
  <% } else if((post.avgRating - i) > 0 && (post.avgRating - i) < 1) { %>
	  <i class="fas fa-star-half-alt"></i>
	<% } else { %>
    <i class="far fa-star"></i>
	<% } %>
<% } %>
<%= `${post.avgRating} star${post.avgRating === 1 ? '' : 's'}` %>
</div>
```
# Seed database
- Add Review model, remove all reviews, and add coordinates to post in seeds.js (/seeds.js)
```JS
const faker = require('faker');
const Post = require('./models/post');

async function seedPosts() {
	await Post.remove({});

	for(const i of new Array(40)) {
		const post = {
			title: faker.lorem.word(),
			description: faker.lorem.text(),
			coordinates: [-122.0842499, 37.4224764],
			author: {
		    '_id' : '5bb27cd1f986d278582aa58c',
		    'username' : 'ian'
		  }
		}
		await Post.create(post);
	}
	console.log('40 new posts created');
}

module.exports = seedPosts;
```
- Uncomment seedPosts function in app.js, save the file with nodemon running, then comment it back out (/app.js)
```JS
// const seedPosts = require('./seeds');
// seedPosts();
```
# Test it out
- Add an extra user to the database so we have three to make reviews with (run in terminal with server running separately)
`curl -d "username=ian3&password=password" -X POST http://localhost:3000/register` 

- Find all users in database using mongo shell
```
mongo
use surf-shop
db.users.find().pretty();
```
- Create a comment using each user's id in your app.js middleware (/app.js)
```
// set local variables middleware
app.use(function(req, res, next) {
  req.user = {
    '_id' : '5bb27cd1f986d278582aa58c', // <--- Replace this id to use each user
    'username' : 'ian'
  }
```
---------------------------------------------------------------------------------------------------------
/* Multer storage cloudinary */

# Remove Local Image Storage

## Delete /uploads directory from app's root directory
- Navigate to root directory of surf-shop app in your terminal and run `rm -rf ./uploads`

## Install multer-storage-cloudinary
- `npm i -S multer-storage-cloudinary`

## Configure Cloudinary and Storage
- Create a folder named `cloudinary` in the app's root directory
- Create an `index.js` file inside of the new /cloudinary directory
- Add the following code to the /cloudinary/index.js file and save it:
```JS
const crypto = require('crypto');
const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'YOUR-CLOUD-NAME-HERE',
	api_key: 'YOUR-API-KEY-HERE',
	api_secret: process.env.CLOUDINARY_SECRET
});
const cloudinaryStorage = require('multer-storage-cloudinary');
const storage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'surf-shop',
  allowedFormats: ['jpeg', 'jpg', 'png'],
  filename: function (req, file, cb) {
  	let buf = crypto.randomBytes(16);
  	buf = buf.toString('hex');
  	let uniqFileName = file.originalname.replace(/\.jpeg|\.jpg|\.png/ig, '');
  	uniqFileName += buf;
    cb(undefined, uniqFileName );
  }
});

module.exports = {
	cloudinary,
	storage
}
```
- Be sure to change cloud_name and api_key values (they're currently located in your `/controllers/posts.js` file)

## Update /routes/posts.js
- Remove: `const upload = multer({'dest': 'uploads/'});`
- Add: `const { cloudinary, storage } = require('../cloudinary');`
- Add: `const upload = multer({ storage });`

## /controllers/posts.js
- Remove: 
```JS
const cloudinary = require('cloudinary');
cloudinary.config({
      cloud_name: 'devsprout',
      api_key: '111963319915549',
      api_secret: process.env.CLOUDINARY_SECRET
});
```
- Add: `const { cloudinary } = require('../cloudinary');`
- Inside both the `postCreate` and `postUpdate` methods, change:
```JS
for(const file of req.files) {
	let image = await cloudinary.v2.uploader.upload(file.path);
	req.body.post.images.push({
		url: image.secure_url,
		public_id: image.public_id
	});
}
```
to:
```JS
for(const file of req.files) {
	req.body.post.images.push({
		url: file.secure_url,
		public_id: file.public_id
	});
}
```
# Continue User Authentication and Authorization

## Update Register and Login
- Comment out the req.user object assignment in app.js where you're setting a user to always be logged in:
```JS
// req.user = {
//   // '_id' : '5bb27cd1f986d278582aa58c',
//   // '_id' : '5bc521c0b142b6d7f7523406',
//   '_id' : '5bfed10ad176f845e38aec92',
//   'username' : 'ian3'
// }
```
- Add a getRegister method to /controllers/index.js right before existing postRegister method
```JS
// GET /register
getRegister(req, res, next) {
	res.render('register', { title: 'Register' });
},
```
- Add getLogin method to /controllers/index.js right before existing postLogin method
```JS
// GET /login
getLogin(req, res, next) {
	res.render('login', { title: 'Login' });
},
```
- Update postRegister method inside of /controllers/index.js

Replace:
```JS
async postRegister(req, res, next) {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		image: req.body.image
	});

	await User.register(newUser, req.body.password);
	res.redirect('/');
},
```
with:
```JS
async postRegister(req, res, next) {
	const newUser = new User({
		username: req.body.username,
		email: req.body.email,
		image: req.body.image
	});

	let user = await User.register(newUser, req.body.password);
	req.login(user, function(err) {
	  if (err) { return next(err); }
	  req.session.success = `Welcome to Surf Shop, ${newUser.username}!`;
	  res.redirect('/');
	});
},
```
- Add getRegister and getLogin methods to /routes/index.js

Replace:
```JS
const { landingPage, postRegister, postLogin, getLogout } = require('../controllers');
```
with:
```JS
const { landingPage, getRegister, postRegister, getLogin, postLogin, getLogout } = require('../controllers');
```
Replace:
```JS
router.get('/register', (req, res, next) => {
  res.send('GET /register');
});
```
with:
```JS
router.get('/register', getRegister);
```
Replace:
```JS
router.get('/login', (req, res, next) => {
  res.send('GET /login');
});
```
with:
```JS
router.get('/login', getLogin);
```

## Create Register and Login Views
- Create a new file inside of /views named register.ejs
- Add the following markup to it:
```HTML
<% layout('layouts/boilerplate') -%>

<form action="/register" method="POST">
	<div>
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" placeholder="username" required>
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="password" id="password" name="password" placeholder="password" required>
	</div>
	<div>
		<label for="email">Email:</label>
		<input type="email" id="email" name="email" placeholder="email" required>
	</div>
	<div>
		<label for="image">Image:</label>
		<input type="file" id="image" name="image">
	</div>
	
	<input type="submit">
</form>
```
- Create a new file inside of /views named login.ejs
- Add the following markup to it:
```HTML
<% layout('layouts/boilerplate') -%>

<form action="/login" method="POST">
	<div>
		<label for="username">Username:</label>
		<input type="text" id="username" name="username" placeholder="username" required>
	</div>
	<div>
		<label for="password">Password:</label>
		<input type="password" id="password" name="password" placeholder="password" required>
	</div>
	
	<input type="submit">
</form>
```

## Update navbar partial
- Replace entire /views/partials/navbar.ejs file with:
```HTML
<style>
	ul {
	  list-style-type: none;
	  margin: 0;
	  padding: 0;
	}
	li {
	  display: inline;
	  padding: 5px;
	}
</style>
<ul>
	<li><a href="/">Home</a></li>
	<li><a href="/posts">Posts</a></li>
	<% if(!currentUser) { %>
		<li><a href="/register">Register</a></li>
		<li><a href="/login">Login</a></li>
	<% } else { %>
		<li><a href="/posts/new">New Post</a></li>
		<li><a href="/logout">Logout</a></li>
		Welcome, <%= currentUser.username %>!
	<% } %>
</ul>
```

## Enforce Unique Emails
- Replace entire /middleware/index.js file with:
```JS
const Review = require('../models/review');
const User = require('../models/user');

module.exports = {
	asyncErrorHandler: (fn) =>
		(req, res, next) => {
			Promise.resolve(fn(req, res, next))
						 .catch(next);
		},
	isReviewAuthor: async (req, res, next) => {
		let review = await Review.findById(req.params.review_id);
		if(review.author.equals(req.user._id)) {
			return next();
		}
		req.session.error = 'Bye bye';
		return res.redirect('/');
	},
	checkIfUserExists: async (req, res, next) => {
		let userExists = await User.findOne({'email': req.body.email});
		if(userExists) {
			req.session.error = 'A user with the given email is already registered';
			return res.redirect('back');
		}
		next();
	}
}
```
- Update middleware in /routes/index.js

Replace:
```JS
const { asyncErrorHandler } = require('../middleware')
```
with:
```JS
const { asyncErrorHandler, checkIfUserExists } = require('../middleware')
```

Replace:
```JS
router.post('/register', asyncErrorHandler(postRegister));
```
with:
```JS
router.post('/register', asyncErrorHandler(checkIfUserExists), asyncErrorHandler(postRegister));
```

## Add Authorization Middleware
- Still needs to be done...
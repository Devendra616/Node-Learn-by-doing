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
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
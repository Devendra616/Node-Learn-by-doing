const User = require('../models/user');
const Post = require('../models/post');
const passport = require('passport');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const util = require('util');
const {cloudinary} = require('../cloudinary');
const {deleteProfileImage} = require('../middlewares');
const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = {
    //GET /
    async landingPage(req,res,next) {
        //sort posts in descending order -_id
        const posts = await Post.find({}).sort('-_id').exec();
        const recentPosts = posts.slice(0, 3); //get top 3 posts
        res.render('index', { posts, mapBoxToken, recentPosts, title: 'Surf Shop - Home' });
    },
    
    //GET /registger
    getRegister(req,res,next){
        res.render('register',{title:'Register',username: '', email: ''});
    },
    //POST Register
    async postRegister(req,res,next){
        console.log('registering user');
        try{
            if(req.file){
                const {secure_url, public_id}= req.file;
                req.body.image ={secure_url, public_id };
            }
            const user =  await User.register(new User(req.body), req.body.password);
            req.login(user, function(err){
                if(err) {
                    return next(err);
                }
                req.session.success = `Welcome to Surf Shop, ${user.username}!`;
                res.redirect('/');
            });
        }catch(err){
            deleteProfileImage(req);
            const {username,email} = req.body;
            let error = err.message;
            console.log(error);
            if (error.includes('duplicate') && error.includes('index: email_1 dup key')) {
                error = 'A user with the given email is already registered';
            }
            res.render('register', { title: 'Register', username, email, error });
        }
    },
      //GET /login
    getLogin(req,res,next){
        //if already logged in move to home page
        if(req.isAuthenticated()) {
            return res.redirect('/');
        }        
        if(req.query.returnTo) req.session.redirectTo = req.headers.referer;//used to redirect to review if not logged in before add review
        res.render('login',{title:'Login'});
    },
    //POST Login
    async postLogin(req,res,next){
        const {username, password} = req.body;
        const {user, error} = await User.authenticate()(username,password);
        if(!user && error){
            return next(error);
        }
        req.login(user,function(err){
            if(err){
                return next(err);
            }
            req.session.success = `Welcome back, ${user.username}!`;
            const redirectUrl = req.session.redirectTo||'/'; //used in view/show add review
            delete req.session.redirectTo;
            res.redirect(redirectUrl);
        });
    },
    //GET /logout
    getLogout(req,res,next){       
            req.logout();
            res.redirect('/');
    },
    async getProfile(req,res,next) {
        const { user }=  req;
        const posts =  await Post.find().where('author').equals(req.user._id).limit(10).exec();
        res.render('profile',{user, posts });
    },
    async updateProfile(req,res,next) {
        const {username, email,password} = req.body;
        const { user }= res.locals;
        if(username)
            user.username = username;
        if(password)    
            user.password = password;
        if(email)    
            user.email = email;
        if(req.file) {
            if(user.image.public_id) await cloudinary.v2.uploader.destroy(user.image.public_id);//delete existing image if exist
            const {secure_url, public_id} = req.file; //get from new image upload
            user.image = {secure_url, public_id};
        }
        await user.save();
        const login = util.promisify(req.login.bind(req));
        await login(user);
        req.session.success = "Profile successfully updated!";
        res.redirect("/profile");
    },
    getForgotPw(req,res,next) {
        res.render('users/forgot');
    },
    async putForgotPw(req,res,next) {
        const token = await crypto.randomBytes(20).toString('hex');
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            req.session.error = 'No account with that email address exists.';
            return res.redirect('/forgot-password');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        //mail composition
        const msg = {
            to: user.email,
            from: 'Surf Shop Admin <devendra.fe@gmail.com>',
            subject: 'Surf Shop - Forgot Password / Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.
                    Please click on the following link, or copy and paste it into your browser to complete the process:
                    http://${req.headers.host}/reset/${token}
                    If you did not request this, please ignore this email and your password will remain unchanged.`.replace(/				/g, ''),//replace blank space by indentation of text editor
            //html:               
          };
        
        await sgMail.send(msg);
        
        req.session.success = `An e-mail has been sent to ${user.email} with further instructions.`;
        res.redirect('/forgot-password');     
    },
    async getResetPw(req,res,next) {
        const { token }= req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now()}// password expiry time more than current time
        });
        if (!user){
            req.session.error = 'Password reset token is invalid or has expired.';
            return res.redirect('/forgot-password');
        }
        res.render('users/reset', { token });
    },
    async putReset(req,res,next) {
        const { token }= req.params;
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now()}// password expiry time more than current time
        });
        if (!user){
            req.session.error = 'Password reset token is invalid or has expired.';
            return res.redirect('/forgot-password');
        }

        if(req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = null;
            user.resetPasswordExpires = null;
            await user.save();
            const login = util.promisify(req.login.bind(req));
            await login(user);
        } else {
            req.session.error = 'Passwords do not match.';
            return res.redirect(`/reset/${ token }`);
        }

        const msg = {
            to: user.email,
            from: 'Surf Shop Admin <devendra.fe@gmail.com>',
            subject: 'Surf Shop - Password Changed',
            text: `Hello,
                  This email is to confirm that the password for your account has just been changed.
                  If you did not make this change, please hit reply and notify us at once.`.replace(/		  	/g, '')
          };
          
          await sgMail.send(msg);
        
          req.session.success = 'Password successfully updated!';
          res.redirect('/');

    }
} 
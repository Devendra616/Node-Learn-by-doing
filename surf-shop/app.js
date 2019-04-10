require('dotenv').config();

const favicon = require('serve-favicon');
const createError = require('http-errors');
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require("express-session");
const logger = require('morgan');
const User = require('./models/user');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
//const seedPosts = require('./seeds');
//seedPosts();

//require routes
const indexRouter = require('./routes/index');
const postsRouter = require('./routes/posts');
const reviewsRouter = require('./routes/reviews');

const app = express();

app.use(favicon(path.join(__dirname,'public','images','shop.png')));

//connect to the database
mongoose.connect('mongodb://localhost/surf-shop',{useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open',() =>{
  console.log("we're connected!");
});

// use ejs-locals for all ejs templates:
app.engine('ejs', engine);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//set public asset directory
app.use(express.static('public'))


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));

//configure passport and session
app.use(session({
  secret: 'w1sh Me Dude!',
  resave: false,
  saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

//session must be before passport
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//title middleware before mounting routes
app.use((req,res,next)=>{
  // req.user = { '_id' : '5ca1f9491d631b0100e0e188', 'username' : 'ian2'
  //   //'_id' : '5ca3bf0c82c01622280e2e0d', 'username' : 'ian4'
  //    //'_id' : '5ca3bf1782c01622280e2e0e', 'username' : 'ian5'
  //   };
  res.locals.currentUser = req.user;
  //sets default title for pages
  res.locals.title = 'Surf Shop';
  //set success flash message
  res.locals.success = req.session.success || ''; //if success not set in req then empty
  delete req.session.success; //delete after assignment
  //set error flash message
  res.locals.error = req.session.error || ''; //if success not set in req then empty
  delete req.session.error; //delete after assignment
  //continue to next function in middleware
  next();
})

//mount routes
app.use('/', indexRouter);
app.use('/posts',postsRouter);
app.use('/posts/:id/reviews', reviewsRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler by express for default usage
app.use(function(err, req, res, next) {
  /* // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error'); */
  console.log(err);
  req.session.error = err.message;
  res.redirect('back');
});

module.exports = app;

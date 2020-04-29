var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var session = require('express-session');
var cookieParser = require('cookie-parser');

app.set('view engine', 'pug');
app.set('views','./views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(upload.array());
app.use(cookieParser());
app.use(session({secret: "Your secret key",
               resave: false,
               saveUninitialized: false}));

var Users = [];

app.get('/', function(req, res){
   res.redirect('/login');
});

app.get('/signup', function(req, res){
   res.render('signup');
});

app.post('/signup', function(req, res){
   if(!req.body.id || !req.body.password){
      res.status("400");
      res.send("Invalid details!");
   } else {
      var unique = true;
      for (var i = 0; i < Users.length; i++){
         if(Users[i].id === req.body.id){
            unique = false;
         }
      }
      if (unique){
         var newUser = {id: req.body.id, password: req.body.password};
         Users.push(newUser);
         req.session.user = newUser;
         res.redirect('/index');
      } else {
         res.render('signup', {
            message: "User Already Exists! Login or choose another user id"});
      }
   }
});

function checkSignIn(req, res, next){
   if(req.session.user){
      console.log(req.session.user);
      next();     //If session exists, proceed to page
   } else {
      res.render('login', {message: "Invalid credentials!"});  //Error, trying to access unauthorized page!
   }
}

app.get('/index', checkSignIn, function(req, res){
   res.render('index', {id: req.session.user.id})
});

app.get('/page1', checkSignIn, function(req, res){
   res.render('page1', {id: req.session.user.id})
});

app.get('/page2', checkSignIn, function(req, res){
   res.render('page2', {id: req.session.user.id})
});

app.get('/page3', checkSignIn, function(req, res){
   res.render('page3', {id: req.session.user.id})
});

app.get('/login', function(req, res){
   res.render('login');
});

app.post('/login', function(req, res){
   if(!req.body.id || !req.body.password){
      res.render('login', {message: "Please enter both id and password"});
   } else {
      console.log(Users);
      var login = false;
      for (var i = 0; i < Users.length; i++){
         if(Users[i].id === req.body.id && Users[i].password === req.body.password){
            req.session.user = Users[i];
            login = true;
         }
      }
      if (login){
         res.redirect('/index');
      } else {
         res.render('login', {
            message: "Invalid credentials!"});
      }
   }

});

app.get('/logout', function(req, res){
   req.session.destroy(function(){
      console.log("user logged out.")
   });
   res.redirect('/login');
});

app.listen(3000);
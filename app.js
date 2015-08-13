var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var partials = require('express-partials');

var methodOverride = require('method-override');

var session = require('express-session');

var routes = require('./routes/index');

// Se quita el contexto users
//var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// add partials
app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded());
app.use(cookieParser('Quiz 2015 Ximo'));
//app.use(session());
app.use(session({
            name: 'quiz-2015-ximo', // configuración de la cookie
            secret: 'ximo',
            resave: true,       // Forces the session to be saved back to the session store
            rolling: true,      // Force a cookie to be set on every response. This resets the expiration date.
            saveUninitialized: false,       //
            cookie: { maxAge: 60000}  // Tiempo de la sesion, expiración de la cookie en 2 min.
}));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req,res,next){

  // guardar path en session.redir para despues de login
  if(!req.path.match(/\/login|\/logout/)){
    req.session.redir = req.path;
  }
  // Hacer visible req.session en las vistas
  res.locals.session = req.session;

      if(req.session.user){
          isFromSession = true;
      }else{
          if(isFromSession){
              isFromSession = false;
              var err = new Error('Sesión Finalizada');
              err.status = 1001;
              next(err);
          }
      }

  next();


});


app.use('/', routes);

// Se quita el contexto users
//app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;

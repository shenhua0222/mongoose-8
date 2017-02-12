var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

mongoose.connect('mongodb://localhost/todo',function(err){
	if(!err) {
		console.log('connect to mongodb');
	} else {
		throw err;
	}
});

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var Task = new Schema({
	task:String
});

var Task = mongoose.model('task',Task);




// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
app.get('/about',function(req,res){
	res.send('hello');
});
app.get('/tasks',function(req,res){
	Task.find({},function(err,docs){
		res.render('tasks/index',{
			title:'Todos index view',
			docs:docs
		});
	});
});

app.get('/tasks/new',function(req,res){
	res.render('tasks/new.jade',{
		title:'New Task'
	});
});

app.post('/tasks',function(req,res){
	var task = new Task(req.body.task);
	task.save(function(err){
		if(!err) {
			res.redirect('/tasks');
		} else {
			res.redirect('/tasks/new');
		}
	});
});

app.get('/tasks/:id/edit',function(req,res){
	Task.findById(req.params.id,function(err,doc){
		res.render('tasks/edit', {
			title:'edit Task View',
			task:doc
		});
	});
});

app.put('/tasks/:id',function(req,res){
	Task.findById(req.params.id,function(err,doc){
		doc.updated_at = new Date();
		doc.task = req.body.task.task;
		doc.save(function(err) {
			if(!err){
				res.redirect('/tasks');
			} else {
				console.err(err);
			}
		})
	})
})

app.delete('/tasks/:id',function(req,res){
	Task.findById(req.params.id, function(err,doc){
		if(!doc) return next(new NotFound('Document not found'));
		doc.remove(function() {
			res.redirect('/tasks');
		});
		
	});
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;

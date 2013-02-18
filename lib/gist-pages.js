var express = require('express'),
  http = require('http'),
  db = require("./gist-db.js"),
  path = require('path');


module.exports = function(dirname, config){

	var app = express();
	if(typeof config=="string"){
		app.github = db.init(dirname+"/"+config);
	}
	else{
		app.github = db.init(config);
	}

	app.configure(function(){
	  app.set('port', process.env.PORT || 3000);
	  app.set('views', dirname + '/views');
	  app.set('view engine', 'ejs');
	  app.use(express.favicon());
	  app.use(express.logger('dev'));
	  app.use(express.bodyParser());
	  app.use(express.methodOverride());
	  app.use(app.router);
	  app.use(express.static(path.join(dirname, 'public')));
	});

	app.configure('development', function(){
	  app.use(express.errorHandler());
	});

	http.createServer(app).listen(app.get('port'), function(){
  		console.log("Express server listening on port " + app.get('port'));
	});

	return app;

}
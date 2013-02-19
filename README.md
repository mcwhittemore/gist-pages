# Gist Pages

Express meets gist.github.com to create an open blogging platform.

# Installing

	npm install gist-pages

## Usage

	var gistPages = require("../lib/gist-pages"); //include gist-pages, express and ejs
	var routes = require('./routes'); //include routes

	//set up your gist.github.com data config
	var config = {
	  //THE USER WHOSE PUBLIC GISTS WILL BE USED
	  username: "YOURUSERNAME",
	  //THE GROUPING RULES. LEAFS SHOULD BE REGEX WILL BE APPLIED TO FILENAMES OF YOUR GISTS
	  groupRules: {
	    "Blog" : /^Blog_/,
	    "fileTypes": {
	      "markdown": /.md$/,
	      "javascript": /.js$/
	    }
	  }
	};

	//create a new server
	var app = gistPages(__dirname, config);

	//attach the github object of the server to the router
	routes.github = app.github;

	//add new get paths
	app.get('/', routes.index);
	app.get('/:post_id', routes.details);
	app.get('/:group/:post_id', routes.details);

## Demo

A small demo is included in the /demo folder.

## Config Object

The config object can either be a JSON object or a module filepath where the module.exports is a JSON object.

The config object has two fields `username` and `groupRules`.

* `username`: a github username
* `groupRules`: a tree of group names that end in a regex rule. This regex rule will be compared to each filename in a gist to determine if the gist fits into the category.

## Github DB API

### getGist(id)

Returns a `gist object`

	var gist = github.getGist('121212');

* id: the gist id. Equal to the value trailing "username/" in the url.

### getGroupGists(group, [flatten, data])

Returns an set of gist ids that match the passed group object from the passed data object. If no data object is passed the gist groups created via the config object will be used.

	var blog_ids = github.getGroupGists("Blog", true);

* group: a string or object used to filter gists. All children will be returned.
* flatten: return the ids as an array or as a tree. Default is false.
* data: an object to select from. Default is the github.group object.

## Gist Object

The [standard gist object](http://developer.github.com/v3/gists/#get-a-single-gist) returned by the github api along with a few extra fields.

### .css

The html github provides to call the needed css for styling .html.

### .html

The html of all the files in the gist.
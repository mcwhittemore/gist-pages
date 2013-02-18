/**
 * Module dependencies.
 */

var gistPages = require("../lib/gist-pages");
var routes = require('./routes');

var config = {
  //THE USERS WHOSE PUBLIC GISTS WILL BE USED
  username: "YOURUSERNAME",
  //THE GROUPING RULES. LEAFS SHOULD BE REGEX
  groupRules: {
    "Blog" : /^Blog_/,
    "fileTypes": {
      "markdown": /.md$/,
      "javascript": /.js$/
    }
  }
};

var app = gistPages(__dirname, config);

routes.github = app.github; //pass the github data object to the router

app.get('/', routes.index); //connect a 
app.get('/:post_id', routes.details);

app.get('/:group/:post_id', routes.details);

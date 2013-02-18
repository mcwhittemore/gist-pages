
/*
 * GET home page.
 */
exports.index = function(req, res, github){
  	
  	if(github.isLoaded){
  		var posts = github.getGroupPosts("Blog");
  		var post = github.getPost(posts[0]);
  		res.render('index', post);
  	}
  	else{
  		exports.index(req, res, github);
  	}
};

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.test = function(req, res, github){

  var posts = github.getGroupPosts("Blog");
  var post = github.getPost(posts[0]);
  
  res.send(post.css+"\n"+post.html);

}



/*
 * GET home page.
 */
exports.index = function(req, res, github){
  	
  	if(github.isLoaded){
  		var posts = github.getCategoryPosts("Blog");
  		console.log(posts);
  		var post = github.getPost(posts[0]);
  		console.log(post);
  		res.render('index', post);
  	}
  	else{
  		exports.index(req, res, github);
  	}

};

exports.list = function(req, res){
  res.send("respond with a resource");
};


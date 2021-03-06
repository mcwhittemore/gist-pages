
exports.github = {};


/*
 * GET home page.
 */
exports.index = function(req, res){
  	
  	var blog_ids = exports.github.getGroupGists("Blog");
    
    var all_ids = exports.github.getGroupGists("fileTypes", true);

    res.render('index', {all_ids: all_ids, blog_ids: blog_ids});
};


exports.details = function(req, res){

  var post_id = req.params.post_id;
  var post = exports.github.getGist(post_id);
  console.log(post.files);

  res.render("detail", post);

}

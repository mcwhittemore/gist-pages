
/*
 * GET home page.
 */


exports.index = function(req, res){

  var data = {title: "test"};

  console.log(test);


  res.render('index', data);
};
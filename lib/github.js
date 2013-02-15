var http = require("https");


var config = {};
config.apikey = undefined;
config.username = undefined;
config.rules = undefined;

var github = module.exports;

github.gists = {};
github.categories = {};
github.isLoaded = false;
github.status = 200;

github.debug = function(where){
	/*console.log("======= "+where+" ========");
	console.log(github.categories);
	console.log();*/
}

github.init = function(configFile){
	github.debug("init");
	config = require(configFile);
	github.loadGists();
	return github;
}

github.onceLoaded = function(callback){
	github.debug("onceloaded");
	setTimeout(function(){
		if(github.isLoaded){
			callback();
		}
		else{
			github.onceLoaded(callback);
		}
	}, 500);
}

github.getCategoryPosts = function(cat){
	github.debug("get cat");
	return github.categories[cat];
}

github.getPost = function(id){
	github.debug("get post");
	return github.gists[id];
}


github.loadGists = function(){
	github.debug("load");
	var url = "https://api.github.com/users/"+config.username+"/gists?callback=success";

	var success = function(res){
		for(var i=0; i<res.data.length; i++){
			var gist = res.data[i];
			github.gists[gist.id] = gist;
		}
		categorize(github);
	}

	var failure = function(res){
		github.status = 500;
		console.log(res);
	}

	github.isLoaded = false;

	call(url, success, success);
}

var categorize = function(github){
	github.debug("categorize start");
	String.prototype.regexIndexOf = function(regex, startpos) {
    	var indexOf = this.substring(startpos || 0).search(regex);
    	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
	}

	var cats = Object.keys(config.rules.categories);

	var gist_ids = Object.keys(github.gists);

	for(var i=0; i<cats.length; i++){
		var cat = cats[i];
		github.categories[cat] = [];

		var rule = config.rules.categories[cat];

		for(var j=0; j<gist_ids.length; j++){

			var id = gist_ids[j];
			var gist = github.gists[id];

			var files = Object.keys(gist.files);

			for(var k=0; k<files.length; k++){
				var file = files[k];
				if(file.regexIndexOf(rule,0)!=-1){
					github.categories[cat][github.categories[cat].length] = id;
					break;
				}
			}

		}
	}

	github.isLoaded = true;

	github.debug("categorize end");
}

var call = function(url, success, failure){
	github.debug("call");
	http.get(url, function(res){
		var data = "";
		res.on("data", function(chunk){
			data+=chunk;
		});
		res.on("end", function(){
            eval(data);
		})
	}).on("error", function(e){
        data = {
            status: "error",
            error: e,
            results: []
        }
        failure(data);
    });
}

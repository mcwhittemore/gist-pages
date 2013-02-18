var http = require("https");


var config = {};
config.apikey = undefined;
config.username = undefined;
config.rules = undefined;

var github = module.exports;

github.gists = {};
github.groups = {};
github.isLoaded = false;
github.status = 200;


String.prototype.regexIndexOf = function(regex, startpos) {
	var indexOf = this.substring(startpos || 0).search(regex);
	return (indexOf >= 0) ? (indexOf + (startpos || 0)) : indexOf;
}

Array.prototype.unique = function(){
	var a = this.concat();
	for(var i=0; i<a.length; ++i){
		for(var j=i+1; j<a.length; ++j){
			if(a[i]===a[j]){
				a.splice(j--,1);
			}
		}
	}
	return a;
}

var document = {};
document.write = function(html){
	return html;
}


github.debug = function(where){
	/*console.log("======= "+where+" ========");
	console.log(Object.keys(github.gists));
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

github.getGroupPosts = function(rule, data, flatten){
	
	data = data || github.groups;
	flatten = flatten || false;

	result = {};

	if(typeof rule == "object" && Object.keys(rule)>0){
		var keys = Object.keys(rule);
		for(var i=0; i<keys; i++){
			var key = keys[i];
			result[keys] = github.getGroupPosts(rule[key], data[key], flatten);
		}
	}
	else{
		result = data[rule];
	}

	if(flatten){
		result = github.flattenGroup(result);
	}
	
	return result;
}

github.getPost = function(id){
	github.debug("get post "+id);
	return github.gists[id];
}

github.loadGists = function(){
	github.debug("load");
	var url = "https://api.github.com/users/"+config.username+"/gists?callback=success";

	var success = function(res){
		if(typeof res.data != "undefined"){
			for(var i=0; i<res.data.length; i++){
				var gist = res.data[i];
				
				github.gists[gist.id] = gist;

				var s = function(id, res){
					var parts = res.split("\n");
					var css = eval(parts[0]);
					var html = "";
					for(var i=1; i<parts.length; i++){
						html+=parts[i];
					}
					html = eval(html);

					github.gists[id].html = html;
					github.gists[id].css = css;

				}

				var u = "https://gist.github.com/"+config.username+"/"+gist.id+".js";

				curl(gist.id, u, s, s);
			}
		}
		else{
			github.status = 500;
		}
		
		github.debug("categorize start");
		github.groups = group(config.groupRules);
		github.isLoaded = true;
		github.debug("categorize end");
	}

	var failure = function(res){
		github.status = 500;
		console.log(res);
	}

	github.isLoaded = false;

	callJSONP(url, success, success);
}





var flattenGroup = function(data){
	var result = [];

	if(Object.keys(data)>0){
		for(var i=0; i<keys; i++){
			var key = keys[i];
			result = result.concat(flattenGroup(data[key]));
		}
	}
	else if(data.length>0){
		result = result.concat(data);
	}
	else{
		result[result.length] = data;
	}

	return result.unique();
}


var group = function(rule){

	var result = {};

	var cats = Object.keys(rule);

	var gist_ids = Object.keys(github.gists);

	for(var i=0; i<cats.length; i++){
		var cat = cats[i];
		var test = rule[cat];

		if(Object.keys(test).length>0){
			result[cat] = group(test);
		}
		else{
			result[cat] = [];
			for(var j=0; j<gist_ids.length; j++){

				var id = gist_ids[j];
				var gist = github.gists[id];

				var files = Object.keys(gist.files);

				for(var k=0; k<files.length; k++){
					var file = files[k];
					if(file.regexIndexOf(test,0)!=-1){
						result[cat][result[cat].length] = id;
						break;
					}
				}
			}
		}
	}

	return result;
}

var callJSONP = function(url, success, failure){
	github.debug("callJSONP");
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

var curl = function(id, url, success, failure){
	github.debug("callJSONP");
	http.get(url, function(res){
		var data = "";
		res.on("data", function(chunk){
			data+=chunk;
		});
		res.on("end", function(){
            success(id, data);
		})
	}).on("error", function(e){
        data = {
            status: "error",
            error: e,
            results: []
        }
        failure(id, data);
    });
}

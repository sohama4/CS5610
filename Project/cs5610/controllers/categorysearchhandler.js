var http = require('http');

/*
used to isolate the desired fields only from the JSON object buffer
buffer currently holds the result of the API search query derived using POST data from /categorysearch
*/
	
function isolateData(buffer)
{
	var articleArray = [];
	var parsedBuffer = JSON.parse(buffer);
	var docs = parsedBuffer.response.docs;
	
	for(var i=0; i<docs.length; i++)
	{
		var newObject =
		{
			web_url: docs[i].web_url,
			snippet: docs[i].snippet,
			multimedia: docs[i].multimedia
		};
		articleArray.push(newObject);

	}
	return articleArray;
}



function categorysearch(req, res)
{
	var articleArray = [];
	// check for cookie and session
	if(req.session.username && req.session.userId && req.cookies.AUTH)
	{
		var toSearch = [];
		var selected = req.body.selected;
		for(var i=0; i<selected.length; i++)
		{
			if(selected[i].indexOf('Sports') !== -1)
				toSearch.push('Sports');
			else if(selected[i].indexOf('Technology') !== -1)
				toSearch.push('Technology');
			else if(selected[i].indexOf('Film') !== -1)
				toSearch.push('Film');
			else if(selected[i].indexOf('Economics') !== -1)
				toSearch.push('Economics');
			else if(selected[i].indexOf('Health') !== -1)
				toSearch.push('Health');
			else if(selected[i].indexOf('Travel') !== -1)
				toSearch.push('Travel');
			else if(selected[i].indexOf('Music') !== -1)
				toSearch.push('Music');
			else if(selected[i].indexOf('Science') !== -1)
				toSearch.push('Science');
		}

		for(var i=0; i<toSearch.length; i++)
		{
			var searchTerm = toSearch[i];
			var url = 'http://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + searchTerm + '&page=0&api-key=e6717d3f1747ae185fe7918feee5b8ef:13:70186283'
			var request = http.get(url, function(response)
			{
				var buffer = '', data, route;
				response.on('data', function(chunk)
				{
					buffer += chunk;
				})
				response.on('end', function(err)
				{
					categoryArray = isolateData(buffer);
					articleArray = articleArray.concat(categoryArray);
				});	
				
			});
		}
	}
	else
	{
		console.log("in else");
		res.clearCookie('AUTH');
		req.session.destroy();
		res.sendfile(basedir + '/views/error.html')
	}
}


function getArray() 
{
	return articleArray	
}

exports.categorysearch = categorysearch
exports.getArray = getArray

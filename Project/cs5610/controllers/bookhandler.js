var http = require('https');
var globalres = null;
var globalreq = null;
function sendObject (receivedObject) 
{
	if(receivedObject.totalItems > 0)
	{
		var selfLink = receivedObject.items[0].selfLink;
		var request = http.get(selfLink, function(response)
		{
			// handle stuff
			var statusCode = response.statusCode;
			if(statusCode < 400)
			{
				
				var buffer = '', data, route;
				response.on('data', function(chunk)
				{
					buffer += chunk;
				})
				response.on('end', function(err)
				{
					globalres.json(JSON.parse(buffer));
				})
			}
			else
			{
				// URL has been tampered :X blast this user out and delete him !
				globalres.status(404).send('Not found');
			}
		});
	}
	
	else
	{
		globalres.json({});
	}
}

function bookhandler (req, res)
{
	globalres = res;
	globalreq = req;
	var isbn = req.originalUrl.substring(7, req.originalUrl.length);


	// call the NYTimes API of books
	var url = 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + isbn;
	var request = http.get(url, function(response)
	{
		// handle stuff
		var statusCode = response.statusCode;
		if(statusCode < 400)
		{
			var buffer = '', data, route;
			response.on('data', function(chunk)
			{
				buffer += chunk;
			})
			response.on('end', function(err)
			{
				sendObject(JSON.parse(buffer));
			})
		}
		else
		{
			// URL has been tampered :X blast this user out and delete him !
			globalres.status(404).send('Not found');
		}
	});

}
exports.bookhandler = bookhandler

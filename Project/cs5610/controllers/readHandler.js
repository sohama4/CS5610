// called when an article is opened for reading
// tasks: insert into dbs and render
var md5 = require('./md5.js');
var MongoClient = require('mongodb').MongoClient;
var htmlparser = require('htmlparser2');
var http = require('http');

var globalres = null;
var globalpath = null;
var globalreq = null;
var globalid = null;
function insertArticle(insertdoc, bufferObject)
{
	var mongourl;
	if(process.env.OPENSHIFT_MONGODB_DB_URL)
		mongourl = process.env.OPENSHIFT_MONGODB_DB_URL + "/CS5610";
	else
		mongourl = "mongodb://127.0.0.1:27017/test";
	MongoClient.connect(mongourl, function (err, db)
	{
		if (err)
		{
			globalreq.session.destroy();
			globalres.clearCookie('AUTH');
			globalres.render(basedir + '/views/error.html', 
			{
				'errors' : ''
			});
			throw err;
		}
		else
		{
			db.createCollection('UserArticles', function(err, collection) 
			{
				if (err)
				{
					globalreq.session.destroy();
					globalres.clearCookie('AUTH');
					globalres.render(basedir + '/views/error.html', 
					{
						'errors' : ''
					});
					throw err;
				}
				else
				{
					collection.insert(insertdoc, {w:1}, function(err, result) 
					{
						if(err)
						{
							globalreq.session.destroy();
							globalres.clearCookie('AUTH');
							globalres.render(basedir + '/views/error.html', 
							{
								'errors' : ''
							});
							throw err;
						}
						else
						{
							console.log("UserArticles insert successful!");
							globalres.json(bufferObject);
						}
					});
				}
			});
		}
	});
}

function collcallback(collection)
{
    //insert in UserArticles first to be discovered
    collection.find({articleID: globalid}).toArray(function(err, cursorArray)
    {
    	if(err)
    		throw err;
    	else
    	{
    		if(cursorArray.length == 0)
    			globalres.json({});
    		else
			{
				var userID = globalreq.session.userId;
				var title = cursorArray[0].title;
				var articleId = globalid;
				var time = Number(Math.floor(new Date().getTime())); // milliseconds since epoch
				var insertdoc = {userID: userID, title: title, articleId: articleId, time: time};
				globaldb.createCollection('UserArticles', function(err, collection) 
				{
					if (err)
					{
						globalreq.session.destroy();
						globalres.clearCookie('AUTH');
						globalres.render(basedir + '/views/error.html', 
						{
							'errors' : ''
						});
						throw err;
					}
					else
					{
						collection.insert(insertdoc, {w:1}, function(err, result) 
						{
							if(err)
							{
								globalreq.session.destroy();
								globalres.clearCookie('AUTH');
								globalres.render(basedir + '/views/error.html', 
								{
									'errors' : ''
								});
								throw err;
							}
							else
							{
								console.log("UserArticles insert successful!");
								globalres.json(cursorArray);
							}
						});
					}
				});
			}
    	}

    });
}

function dbcallback(db)
{
    globaldb = db;
    db.createCollection('WrittenArticles', function(err, collection) 
    {
        if (err)
        {
            console.log('Error in collection: WrittenArticles');
            globalres.sendfile(basedir + '/views/error.html');
            throw err;
        }
        else
            collcallback(collection);
    });
}

function readHandler (req, path, res) 
{
	
	globalres = res;
	globalreq = req;
	globalpath = path;
	if(path.indexOf('/view/user/') === 0)
	{
		var id = path.substring(11, path.length); // id of locally written article
		globalid = id;
		var mongourl;
	    if(process.env.OPENSHIFT_MONGODB_DB_URL)
	        mongourl = process.env.OPENSHIFT_MONGODB_DB_URL + "/CS5610";
	    else
	        mongourl = "mongodb://127.0.0.1:27017/test";
	    MongoClient.connect(mongourl, function (err, db)
	    {
	        if (err)
	        {
	            console.log('Error in connection: MongoDB');
	            globalres.sendfile(basedir + '/views/error.html');
	            throw err;
	        }
	        else
	        	dbcallback(db);
		});
	}
	else
	{
		var id = path.substring(6, path.length); // id of The Guardian resource
		var url = 'http://content.guardianapis.com/' + id +'?api-key=pkcztdbthwfvd64t5ev32p35&show-fields=all';
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
					// insert this URL into DB corresponding to the userID from session
					// no tampering with the URL
					var articleId = id;
					var time = Number(Math.floor(new Date().getTime())); // milliseconds since epoch
					var bufferObject = JSON.parse(buffer);
					var insertdoc = {userID: globalreq.session.userId, URL: bufferObject.response.content.webUrl, title: bufferObject.response.content.webTitle, articleId: articleId, time: time};
					insertArticle(insertdoc, bufferObject);
				});
			}
			else
			{
				globalres.status(response.statusCode).send("Error");
			}
		});
	}
}
exports.readHandler = readHandler;
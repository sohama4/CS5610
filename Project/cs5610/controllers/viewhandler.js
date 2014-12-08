var md5 = require('./md5.js');
var MongoClient = require('mongodb').MongoClient;
var htmlparser = require('htmlparser2');
var http = require('http');

var globalres = null;
var globaldb = null;
var globalreq = null;
var globalpath = null;


/*
	since the collection of articles is too vast to keep track of, 
	we can keep track of which articles the user has clicked.
	we can redisplay this on another page! also we can try to connect this
	functionality to the comments functionality.
*/
function insertArticle(insertdoc, content, redirectUrl)
{
	globaldb.createCollection('UserArticles', function(err, collection)
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
				console.log("Locally generated article inserted in user activity!");
				globalres.render(basedir + '/views/view.html',
				{
					'view': content,
					'url': redirectUrl
				});
			}
		});
	});
}


function viewhandler(req, path, res)
{
	globalres = res;
	globalpath = path;
	globalreq = req;
	httpGet('http://' + req.headers.host + path);
}

/*
GETs the URL
*/
function httpGet(redirectUrl)
{
	console.log(redirectUrl);
	var checkdoc = {URL: redirectUrl};
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
			globaldb = db;
			db.createCollection('WrittenArticles', function(err, collection) 
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
					collection.find(checkdoc).toArray(function(err, cursorArray)
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
							if(cursorArray.length === 0)
								// no article with this URL exists
								globalres.render(basedir + '/views/redirecterror.html',
								{
									'error': redirectUrl,
									'statusCode': 404
								});
							else
							{
								var content = cursorArray[0].content;
								var articleId = md5.md5(redirectUrl);
								var time = Number(Math.floor(new Date().getTime())); // milliseconds since epoch
								var insertdoc = {userID: globalreq.session.userId, articleId: articleId, time: time};
								insertArticle(insertdoc, content, redirectUrl);
							}
						}
					});
				}
			});
		}
	});
}




exports.viewhandler = viewhandler
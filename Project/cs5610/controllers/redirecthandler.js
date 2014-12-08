var md5 = require('./md5.js');
var MongoClient = require('mongodb').MongoClient;
var htmlparser = require('htmlparser2');
var http = require('http');

var globalreq = null;
var globalres = null;
var globalpath = null;


/*
	since the collection of articles is too vast to keep track of, 
	we can keep track of which articles the user has clicked.
	we can redisplay this on another page! also we can try to connect this
	functionality to the comments functionality.
*/
function insertArticle(insertdoc, buffer, redirectUrl)
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
							db.createCollection('Articles', function(err, collection) 
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
									// find, update if not insert
									var item = {ID: insertdoc.articleId, URL: redirectUrl};
									insertOrUpdate(item, collection, buffer, redirectUrl);
								}
							});
						}
					});
				}
			});
		}
	});
}


function insertOrUpdate(item, collection, buffer, redirectUrl)
{
	console.log(item.ID);
	collection.find({ID: item.ID}).count(function(err, countEntries)
	{
		if(err)
		{
			globalreq.session.destroy();
			globalres.clearCookie('AUTH');
			globalres.render(basedir + '/views/error.html', 
			{
				'errors' : ''
			});
			console.log("Error in find");
			throw err;
		}
		else
			switch(countEntries)
			{

				case 0:
					// entirely new article, insert this!
					collection.insert(item, {w: 1}, function(err, result)
					{
						if(err)
						{
							console.log("Error in inserting Article in collection: Articles")
							throw err;
						}
						else
						{
							console.log("Article inserted!");
							renderToUser(buffer, redirectUrl);

						}
					});
					break;						
				case 1:
					// Article has been read
					// do nothing
					console.log("Previously read article!");
					renderToUser(buffer, redirectUrl);
					break;
			}
	});
}

function renderToUser (buffer, redirectUrl) 
{
	var cheerio = require('cheerio'),
		$ = cheerio.load(buffer);

	var text = $('div[itemprop=articleBody]').html();
	
	if(text == '')
		text = $('div[itemprop=reviewBody]').html();

	if(text == '')
		text = $('div[id=article-body-blocks]').html();


	var i = 0;
	while(i < text.length)
	{
		var index = text.indexOf('</p>');
		var ptext = text.substring(i, index+4);

	}
	var toBeRendered = '';

	

	


	globalres.render(basedir + '/views/view.html',
	{
		'view': toBeRendered,
		'url': redirectUrl
	});
}

function redirecthandler(req, path, res)
{
	var redirectUrl = path.substring(8, path.length);
	globalres = res;
	globalpath = path;
	globalreq = req;
	httpGet(redirectUrl);
}

/*
GETs the URL
*/
function httpGet(redirectUrl)
{
	var request = http.get(redirectUrl, function(response)
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
				var articleId = md5.md5(redirectUrl);
				var time = Number(Math.floor(new Date().getTime())); // milliseconds since epoch
				var insertdoc = {userID: globalreq.session.userId, articleId: articleId, time: time};
				insertArticle(insertdoc, buffer, redirectUrl);
			})
		}
		else
		{
			// URL has been tampered :X blast this user out and delete him !
			globalres.render(basedir + '/views/redirecterror.html',
			{
				'error': redirectUrl,
				'statusCode': statusCode

			});
		}
	});
}
exports.redirecthandler = redirecthandler;
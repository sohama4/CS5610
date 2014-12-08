var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var toSend = [];
var globalres = null;
var globalreq = null;


function getArticleLinks (cursorArray, db) 
{
	for(var i=0; i<cursorArray.length; i++)		
		getArticleLinksHelper(cursorArray[i], db, cursorArray.length);

}


function getArticleLinksHelper(cursor, db, length)
{
	var time = cursor.time;
	db.createCollection('Articles', function(err, collection)
	{
		if(err)
			throw err;
		else
		{
			collection.find({ID: cursor.articleId}).toArray(function(err, cursorArray) 
			{
				toSend.push({time: time, url: cursorArray[0].URL});
				if(toSend.length == length)
				{
					toSend = toSend.sort(function(a, b)
					{
						return a.time > b.time
					});
					toSend.reverse();
					globalres.json(toSend);

					toSend = []; // Damn this took long! A critical piece of code, debugged expertly by Soham Aurangabadkar at 0932 11/21 :D
				}
			});
		}
	});
}

function activityhandler(req, res)
{
	globalres = res;
	globalreq = req;
	var mongourl;
	if(process.env.OPENSHIFT_MONGODB_DB_URL)
		mongourl = process.env.OPENSHIFT_MONGODB_DB_URL + "/CS5610";
	else
		mongourl = "mongodb://127.0.0.1:27017/test";
	MongoClient.connect(mongourl, function (err, db)
	{
		if (err)
			throw err;
		else
		{
			// get the logged in user
			var username = req.session.username;
			var currentUserID = req.session.userId;
			// get the articleID stored alongsude the UserID from the database
			db.createCollection('UserArticles', function(err, collection) 
			{
				var toSend = [];
				if (err)
					throw err;
				else
					collection.find({'userID': currentUserID}).toArray(function(err, cursorArray)
					{
						if(err)
						{
							console.log("Error in accessing collection: UserArticles");
							throw err;
						}
						else
						{
							cursorArray = cursorArray.sort(function(a, b)
							{
								return a.time > b.time
							});
							cursorArray.reverse();
							var length = cursorArray.length;
							if(length == 0)
								res.json({});
							else
								res.json(cursorArray);
						}
					});
			});
		}
	});
}
exports.activityhandler = activityhandler
var globalres = null;
var globalreq = null;
var toSend = [];

// postponed

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


function writtenhandler(req, res)
{
	globalreq = req;
	globalres = res;

	// get the userId and username from the session

	var username = globalreq.session.username;
	var currentUserID = globalreq.session.userId;

	if(process.env.OPENSHIFT_MONGODB_DB_URL)
		mongourl = process.env.OPENSHIFT_MONGODB_DB_URL + "/CS5610";
	else
		mongourl = "mongodb://127.0.0.1:27017/test";
	MongoClient.connect(mongourl, function (err, db)
	{
		if(err)
		{
			console.log('Error in connection to MongoDB');
			globalres.sendfile(basedir + '/views/error.html');
			throw err;
		}
		else
		{
			db.createCollection('WrittenArticles', function(err, collection) 
			{
				if (err)
				{
					console.log('Error in collection: WrittenArticles');
					globalres.sendfile(basedir + '/views/error.html');
					throw err;
				}
				else
					collection.find({'userID': currentUserID}).toArray(function(err, cursorArray)
					{
						// should return a Cursor with articles written by currentUserID
						var length = cursorArray.length;
						if(length == 0)
							// no articles written yet
							globalres.json({});
						else
							// get the URLs of the articles
							getArticleLinks(cursorArray, db);
					});
			});
		}
	});
}
exports.writtenhandler = writtenhandler
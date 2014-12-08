var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
function viewWrittenHandler(req, res)
{
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
			db.createCollection('WrittenArticles', function(err, collection) 
			{
				var toSend = [];
				if (err)
					throw err;
				else
					collection.find({'UserID': currentUserID}).toArray(function(err, cursorArray)
					{
						if(err)
						{
							console.log("Error in accessing collection: WrittenArticles");
							throw err;
						}
						else
						{
							var length = cursorArray.length;
							if(length == 0)
								// no articles read yet
								res.json({});
							else
							{
								// sort the Articles by time and return
								
								cursorArray = cursorArray.sort(function(a, b)
								{
									return a.time > b.time
								});
								cursorArray.reverse();
								res.json(cursorArray);

							}	
						}
					});
			});
		}
	});
}
exports.viewWrittenHandler = viewWrittenHandler
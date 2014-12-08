var MongoClient = require('mongodb').MongoClient;
globalres = null;
globalreq = null;
function collcallback(username, collection)
{
	
	collection.update({userID: 1}, 
	{$set: {userName: username}},
	function(err, result)
	{
		if(err)
			throw err;
		else
		{
			globalres.send("State updated!");
		}
	});
}
function dbcallback(username, db)
{
	db.createCollection('UpdateCollection', function(err, collection) 
	{
		if (err)
			throw err;
		else		
			collcallback(username, collection);
	});
}

function updateHandler(username, res)
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
			globalres = res;
			dbcallback(username, db);
		}
	});
}
exports.updateHandler = updateHandler;
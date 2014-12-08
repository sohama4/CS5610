
/*
searchhandler.js - called when the user wants to search articles locally in /search
the URL with which this page comes into play is /searchme
task - initialize the 'Written' Collection in the local MongoDB and search the content
*/
var MongoClient = require('mongodb').MongoClient;
var globalreq = null;
var globalres = null;
var searchTerm = null;

function dbcallback(db)
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
            collcallback(collection)
    });
}


function collcallback (collection)
{
	
	collection.find().toArray(function(err, items) 
  	{
  		var toSend = [];
      searchTerm = searchTerm.toLowerCase();
  		for(var i=0; i<items.length; i++)
  		{
  			var content = items[i].content;
        var title = items[i].title;
  			((content.toLowerCase().indexOf(searchTerm) > -1) || (title.toLowerCase().indexOf(searchTerm) > -1)) ? toSend.push(items[i]) : i = i
  		}
    	globalres.send(JSON.stringify(toSend));
  	});
}

function searchhandler (req, res) 
{
	globalres = res;
    globalreq = req;
    var localSearchTerm = globalreq.originalUrl.substring(10, globalreq.originalUrl.length);
    
    if(localSearchTerm === '')
    	globalres.send(JSON.stringify([]));
    else
    {
    	searchTerm = localSearchTerm;	
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
}
exports.searchhandler = searchhandler
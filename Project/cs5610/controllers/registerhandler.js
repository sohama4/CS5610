var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var mailclient = require('./sendmail.js')
var md5 = require('./md5.js');

function collcallback(req, res, collection)
{
	var username = req.body.username;
	var fname = req.body.fname;
	var lname = req.body.lname;
	
	
	// check if already exists
	collection.find({username: username}).count(function(err, countEntries) 
	{
		if(err)
			throw err
		else
        	if(countEntries == 0)
        	{
        		var password = md5.md5(Math.floor(Math.random() * 343597384 + 8717181) + '');
				password = password.substring(2, 10);
				var dbpass = md5.md5(password);
				var insertdoc = {username: username, fname: fname, lname: lname, generatedpassword: dbpass, password: null};
        		collection.insert(insertdoc, {w:1}, function(err, result) 
				{
					if(!err)
					{
						console.log("Insert successful!");
						mailclient.sendConfirmation(username, fname, password);
						var url;
						if(process.env.OPENSHIFT_APP_DNS)
							url = 'http://' + process.env.OPENSHIFT_APP_DNS + '/registersuccess'
						else
							url = 'http://127.0.0.1:8080/registersuccess'
							res.redirect(url);
					}
					else
						throw err;
				});
        	}
        	else
        	{
        		res.render(basedir + '/views/register.html', 
				{
					'errors': 'That e-mail is already taken. Sorry!'
				});
			}
    });
	
}

function dbcallback(req, res, db)
{
	db.createCollection('RegisteredUsers', function(err, collection) 
	{
		if (err)
			throw err;
		else
			collcallback(req, res, collection)
	});
}


function register(req, res)
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
			dbcallback(req, res, db);
	});
}
exports.register = register

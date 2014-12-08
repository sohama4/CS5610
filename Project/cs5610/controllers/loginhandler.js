var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var md5 = require('./md5.js');
var crypto = require('crypto');
var statehandler = require('./statehandler.js');

function collcallback(req, res, collection)
{
	var username = req.body.username;
	var password = md5.md5(req.body.password);

	collection.find({username: username, generatedpassword: password}).count(function(err, countEntries)
	{
		if(err)
			throw err
		else if(countEntries == 1)
		{

			/* 
			user is trying to log in with autogenerated password
			send page for new password, and update in db
			*/
			var url;

			res.cookie('hashed', username);
			req.session.prev = '/login';
			if(process.env.OPENSHIFT_APP_DNS)
				url = 'http://' + process.env.OPENSHIFT_APP_DNS + '/confirmpassword'
			else
				url = 'http://127.0.0.1:8080/confirmpassword'
			
			res.redirect(url);
		}
		else
			collection.find({username: username, password: password}).count(function(err, countEntries)
			{
				if(err)
					throw err
				else	
					if(countEntries == 1)
					{
						/*
						cookie generation and storage
						objective = to make as secure as possible
						*/
						statehandler.statehandler(req, null, username, res);
						
					}
					else
					{
					    res.render(basedir + '/views/login.html', 
					    {
					        'errors': 'Incorrect username and/or password.'
					    });
					}
			});
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

function login(req, res)
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
exports.login = login
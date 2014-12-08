var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var md5 = require('./md5.js');
var crypto = require('crypto');
globalres = null;
globalreq = null;
function collcallback(token, username, collection, reguserscollection)
{
	// get the userID associated with the username
	reguserscollection.find({username: username}).count(function(err, countEntries)
	{
		if(err)
			throw err;
		else
		{
			switch(countEntries)
			{
				case 0:
				// chutya
				case 1:
				// proper
				// retrieve userID and insert in second Collection
					reguserscollection.find({username: username}, function(err, doc)
					{
						if(err)
							throw err;
						else
							doc.nextObject(function(err, item)
							{
								if(err)
									throw err;
								else
									insertOrUpdate(item, collection);
							});
					});
					break;
				case 2:
				// error


			}
		}
	});
}

function insertOrUpdate(item, collection)
{
	crypto.randomBytes(256, function(err, buf) 
	{
		if (err)
			throw err;
		else
		{
			var token = buf.toString('hex');
			var time = md5.md5(new Date().getTime() + '');
			var insertdoc = {userID: item._id, token: token, time: time};
			// there might be two possibilities here: the user might already exist
			// or this might be a new user entirely, who is logging in for the first time
			// check find; if 1 update, if 0 insert, if else error out
			collection.find({userID: insertdoc.userID}).count(function(err, countEntries)
			{
				if(err)
				{
					throw err;
				}
				else
					switch(countEntries)
					{

						case 0:
							// entirely new user, insert this!
							collection.insert(insertdoc, {w: 1}, function(err, result)
							{
								if(err)
									throw err;
								else
								{
									console.log("State inserted!");
									afterInsertOrUpdate(item, insertdoc);
								}
							});
							break;						
						case 1:
							// user had logged in previously
							collection.update({userID: insertdoc.userID}, 
								{$set: {token: insertdoc.token, time: insertdoc.time}},
								function(err, result)
								{
									if(err)
										throw err;
									else
									{
										console.log("State updated!");
										afterInsertOrUpdate(item, insertdoc);
									}
								});
							break;
						default:
							// not a pleasant case to be in
							globalres.clearCookie('hashed');
							globalres.clearCookie('AUTH');
							globalreq.session.destroy();
							globalres.render(basedir + '/views/error.html', 
							{
								'errors' : ''
							});
							break;
					}
			});
		}
	});
}

function afterInsertOrUpdate (item, insertdoc) 
{
	var loggedInUserId = item._id;
	var loggedInUser = item.username;
	var token = insertdoc.token;
	var time = insertdoc.time;
	var cookieData = token + ":" + time;
	var key       = 'certainsecret';
	var algorithm = 'sha256';
	var hash, hmac;
	hmac = crypto.createHmac(algorithm, key);
	hmac.setEncoding('hex');
	hmac.write(cookieData);
	hmac.end();
	hash = hmac.read();
	cookieData = cookieData + ":" + hash;
	var url;
	if(process.env.OPENSHIFT_APP_DNS)
		url = 'http://' + process.env.OPENSHIFT_APP_DNS + '/loginsuccess'
	else
		url = 'http://127.0.0.1:8080/loginsuccess'
	globalreq.session.username = loggedInUser;
	globalreq.session.userId = loggedInUserId;
	globalres.clearCookie('hashed');
	if(globalreq.body.loggedin == undefined)
	{
		globalres.cookie('AUTH', cookieData)	
	}
	else
	{
		globalreq.session.cookie.maxAge = 2628000000;
		globalres.cookie('AUTH', cookieData, { maxAge: 2628000000 });
			
	}
	globalres.redirect(url);
}


function dbcallback(token, username, db)
{
	db.createCollection('UserStates', function(err, collection) 
	{
		if (err)
			throw err;
		else
		{
			db.createCollection('RegisteredUsers', function(err, reguserscollection) 
			{
				if (err)
					throw err;
				else
				{
					collcallback(token, username, collection, reguserscollection);
				}
			});
		}
	});
}

function statehandler(req, token, username, res)
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
			globalreq = req;
			dbcallback(token, username, db);
		}
	});
}
exports.statehandler = statehandler;
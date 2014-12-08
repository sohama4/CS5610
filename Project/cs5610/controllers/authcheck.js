var MongoClient = require('mongodb').MongoClient;
var format = require('util').format;
var redirecthandler = require('./redirecthandler.js');
var activityhandler = require('./activityhandler.js');
var writtenhandler = require('./writtenhandler.js');
var viewhandler = require('./viewhandler.js');
var searchhandler = require('./searchhandler.js');
var viewWrittenHandler = require('./viewwritten.js');
var readHandler = require('./readHandler.js')
// route handling function for the case where there is no user or session data
// this function involves presenting users with the homepage when they try to access 
// areas of the site that are only accessible to logged in users
function routeHandler(req, path, res)
{
	if(path.indexOf('/readarticle/') === -1 && path.indexOf('/redUrl') === -1 && path.indexOf('/review') === -1 && path.indexOf('/writtenbyme') === -1 && path.indexOf('/write') === -1 && path.indexOf('/activity') === -1 && path.indexOf('/viewActivity') === -1 && path.indexOf('/search') === -1 && path.indexOf('/searchme') === -1)
		switch(path)
		{

			case '/':
				res.render(basedir + '/views/home.html');
				break;
			case '/register':
			    res.render(basedir + '/views/register.html', 
				{
				    'errors': ''
				});
				break;
			case '/login':
			    res.render(basedir + '/views/login.html', 
				{
				    'errors': ''
				});
				break;
			case '/loginsuccess':
				res.render(basedir + '/views/home.html');
				break;
			case '/registersuccess':
				res.render(basedir + '/views/registerlanding.html');
				break;
			case '/books':
				res.render(basedir + '/views/books.html', 
				{
				    'search': 'Search Books!',
				    'bestsellers': 'Best-Sellers',
				    'register': 'Register',
				    'login': 'Login',
				    'why' : 'Books'
				});
				break;
			case '/booksearch':
				res.render(basedir + '/views/booksearch.html', 
				{
				    'search': 'Search Books!',
				    'bestsellers': 'Best-Sellers',
				    'register': 'Register',
				    'login': 'Login',
				    'why' : 'Books'
				});
				break;
			case '/list':
				res.render(basedir + '/views/list.html', 
				{
				    'search': 'Search Books!',
				    'bestsellers': 'Best-Sellers',
				    'register': 'Register',
				    'login': 'Login',
				    'why' : 'Books'
				});
				break;
			case '/confirmpassword':
			    if(req.session.prev == '/login' && req.cookies.hashed !== undefined)
			    {
			    	res.render(basedir + '/views/confirmpassword.html', 
					{
					    'errors': ''
					});
			    }
				else
				{
					res.redirect('/');
				}
				break;
		}
	else if(path.indexOf('/review') === 0)
		// try to handle
		if(path.length < 8)
			res.render(basedir + '/views/error.html');
		else
			res.render(basedir + '/views/review.html', 
			{
			    'search': 'Search Books!',
			    'bestsellers': 'Best-Sellers',
			    'register': 'Register',
			    'login': 'Login',
			    'why' : 'Books'
			});
	else
	{
		// this is the URL where we have to display the page from the API in another page
		// for this feature the user HAS TO BE logged in
		// send to login page and generate an error
	    res.render(basedir + '/views/login.html', 
		{
		    'errors': 'You have to be logged-in to use the feature: ' + path
		});

	}

}

// function authcheck() routes to this function if both cookie and session data seem correct
// cookie is comprised of user-specific token, generated time , and HMAC to ensure integrity
// someone can tamper with the cookie, which this function tries to prevent
// if the HMACs do not match or if the cookie data does not match the database, the user is taken to a 
// safe starting point
function verifyCookie(req, cookieData, res)
{
	console.log("4");
	var token = cookieData.split(":")[0];
	var time = cookieData.split(":")[1];
	var hashed = cookieData.split(":")[2];
	var crypto    = require('crypto');
	var key       = 'certainsecret';
	var algorithm = 'sha256';
	var hash, hmac;
	hmac = crypto.createHmac(algorithm, key);
	hmac.setEncoding('hex');
	hmac.write(token + ":" + time);
	hmac.end();

	hash = hmac.read();
	if(hash == hashed)
	{
		// cookie has not been tampered with
		// verify user
		var checkdoc = {token: token, time: time};
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
				db.createCollection('UserStates', function(err, collection) 
				{
					if (err)
						throw err;
					else
						collection.find(checkdoc).count(function(err, countEntries)
						{
							if (err)
								throw err;
							else
								switch(countEntries)
								{
									case 1:
										if(req.originalUrl == '/activity')
											activityhandler.activityhandler(req, res);
										else if(req.originalUrl.indexOf('/searchme') == 0)
											searchhandler.searchhandler(req, res);
										else if(req.originalUrl.indexOf('/writtenbyme') == 0)
											viewWrittenHandler.viewWrittenHandler(req, res);
										else if(req.originalUrl == '/written')
											writtenhandler.writtenhandler(req, res);
										else if(req.originalUrl == '/viewActivity')
											res.sendfile(basedir + '/views/viewActivity.html');
										else if(req.originalUrl == '/books')
											res.render(basedir + '/views/books.html', 
											{
											    'search': 'Search Books!',
											    'bestsellers': 'Best-Sellers',
											    'register': 'User Activity',
											    'login': 'Log out!',
											    'why' : 'Books'
											});

										else if(req.originalUrl == '/search')
											res.sendfile(basedir + '/views/search.html');
										else if(req.originalUrl == '/write')
											res.render(basedir + '/views/write.html', 
											{
											    'errors': ''
											});
										else if(req.originalUrl == '/booksearch' || req.originalUrl == '/list')
											res.render(basedir + '/views' + req.originalUrl + '.html', 
											{
											    'search': 'Search Books!',
											    'bestsellers': 'Best-Sellers',
											    'register': 'User Activity',
											    'login': 'Log out!',
											    'why' : 'Books'
											});
										else if(req.originalUrl.indexOf('/review/') === 0)
											if(req.originalUrl.length < 8)
												res.render(basedir + '/views/error.html');
											else
												res.render(basedir + '/views/review.html', 
												{
												    'search': 'Search Books!',
												    'bestsellers': 'Best-Sellers',
												    'register': 'User Activity',
												    'login': 'Log out!',
												    'why' : 'Books'
												});
										else if(req.originalUrl.indexOf('/readarticle/') === 0)
											if(req.originalUrl.length < 13)
												res.render(basedir + '/views/error.html');
											else
												res.render(basedir + '/views/readarticle.html', 
												{
												    'search': 'Search Books!',
												    'bestsellers': 'Best-Sellers',
												    'register': 'User Activity',
												    'login': 'Log out!',
												    'why' : 'Books'
												});
										else
											res.render(basedir + '/views/loginsuccess.html', 
											{
											    'errors': ''
											});
										break;
									default:
										// there is no userId associated with this token and time
										res.clearCookie('AUTH');
										req.session.destroy();
										res.render(basedir + '/views/error.html');
										break;
								}
						});
				});
		});
	}
	else
	{
		console.log("5");
		// the hash of the token and the time does not match the HMAC attached at the end
		res.clearCookie('AUTH');
		req.session.destroy();
		res.render(basedir + '/views/error.html');
	}
}


// routing function that redirects users to various views
// the main logic involves checking for integrity of sessions and cookies
// the cases this resolves into give the condition for apporpriate handling of routes
function authcheck(req, cookieData, res)
{
	
	path = req.originalUrl;	
	if(req.session.username !== undefined && req.session.userId !== undefined && cookieData == undefined)
	{
		console.log("1");
		// user is in session but cookie has been deleted
		// delete the session and present error page
		req.session.destroy();
		res.render(basedir + '/views/error.html');
	}
	else if((req.session.username == undefined || req.session.userId == undefined) && cookieData !== undefined)
	{		
		console.log("2");
		req.session.destroy();
		res.clearCookie('AUTH');
		//cookie is present but some error with the session
		res.render(basedir + '/views/error.html');
	}
	else if(req.session.username == undefined && req.session.userId == undefined && cookieData == undefined)
	{
		console.log("3");
		// no session, no user, no error
		routeHandler(req, path, res);
	}
	else
	{
			if(path.indexOf('/redUrl/') === 0)
				redirecthandler.redirecthandler(req, path, res);
			else if(req.originalUrl.indexOf('/view/') == 0)
				readHandler.readHandler(req, path, res);
			else
				verifyCookie(req, cookieData, res);
	}
}
exports.authcheck = authcheck;
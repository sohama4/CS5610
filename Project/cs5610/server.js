// required NodeJS modules
var express = require('express');
var fs = require('fs')
var app = express();
var swig  = require('swig');
var bodyParser = require('body-parser');



// connect-mongo module to use sessions in connection with MongoDB
var mongourl;
if(process.env.OPENSHIFT_MONGODB_DB_URL)
    mongourl = 'mongodb://' + process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' 
                + process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@'
                + process.env.OPENSHIFT_MONGODB_DB_HOST
                + ':' 
                + process.env.OPENSHIFT_MONGODB_DB_PORT 
                + '/cs5610'
else
    mongourl = 'mongodb://127.0.0.1:27017/test'

var MongoStore = require('connect-mongo')(express);
app.use(express.cookieParser());
app.use(express.session({
  store: new MongoStore({
    url: mongourl
  }),
  secret: '1234567890QWERT'
}));

// required JavaScript files
var bookhandler = require('./controllers/bookhandler.js')
var sendmailexp = require('./controllers/sendmailexp.js')
var register = require('./controllers/registerhandler.js');
var login = require('./controllers/loginhandler.js');
var confirmpassword = require('./controllers/confirmpasswordhandler.js');
var authcheck = require('./controllers/authcheck.js');
var categorysearch = require('./controllers/categorysearchhandler.js');
var updateHandler = require('./controllers/updateHandler.js');
var writesubmit = require('./controllers/writesubmit.js');


// port and IP Address for the Express server to listen to
var port = process.env.OPENSHIFT_NODEJS_PORT || 8080; 
var ipaddr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
global.basedir = __dirname;


// middleware that the Express.js app uses
app.use(express.bodyParser());
app.use(app.router);
app.engine('html', swig.renderFile);
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded(
{
    extended: true
}));


app.use('/experiment', function (req, res, next) 
{
    res.send("You requested: " + req.originalUrl);
});

app.use('/redUrl', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.use('/searchme', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.use('/readarticle/', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.use('/about', function (req, res, next) 
{
    bookhandler.bookhandler(req, res);
});

app.use('/view/', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.use('/review', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.use('/user', function (req, res, next) 
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});


/*****************************************************************************
    PROJECT STATIC FILES REQUEST HANDLER
******************************************************************************/

app.use(express.static(__dirname + '/public'));

/*****************************************************************************
    PROJECT GET REQUEST HANDLERS
******************************************************************************/


app.get('/books', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/booksearch', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/list', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/write', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/writtenbyme', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/register', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/activity', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/search', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});


app.get('/viewActivity', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/login', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/loginsuccess', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/confirmpassword', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});

app.get('/registersuccess', function (req, res)
{
    var cookieData = req.cookies.AUTH;
    authcheck.authcheck(req, cookieData, res);
});


app.get('/logout', function (req, res) 
{
    req.session.destroy();
    res.clearCookie('AUTH');
    res.redirect('/');
}); 



/*****************************************************************************
    EXPERIMENT GET REQUEST HANDLERS
******************************************************************************/

app.get('/sendmail', function (req, res)
{
    res.sendfile(__dirname + '/views/sendmailexp.html');
});

app.get('/swig', function (req, res)
{
    res.render(__dirname + '/views/swig.html',
    {
        'text': ''
    });
});

app.get('/cookieset', function (req, res)
{
    res.sendfile(__dirname + '/views/cookieexp.html');

});

app.get('/dynamic', function (req, res)
{
    res.render(__dirname + '/views/dynamicexp.html', 
    {
        'errors': ''
    });
});

app.get('/update', function (req, res)
{
    res.render(__dirname + '/views/update.html', 
    {
        'errors': ''
    });
});

/*****************************************************************************
    PROJECT POST REQUEST HANDLERS
******************************************************************************/

app.post('/register', function (req, res)
{
    register.register(req, res);
});

app.post('/swig', function (req, res)
{
    res.render(__dirname + '/views/swig.html',
    {
        'text': req.body.newname
    });
});

app.post('/categorysearch', function (req, res)
{
    
    categorysearch.categorysearch(req, res);
});

app.post('/writesubmit', function (req, res)
{
    writesubmit.writesubmit(req, res);
});


app.post('/login', function (req, res)
{
    login.login(req, res);
});

app.post('/confirmpassword', function (req, res)
{
    if(req.cookies.hashed) 
    {
        confirmpassword.confirmpassword(req, res, req.cookies.hashed);
    }
    else
        res.send(basedir + '/views/error.html');  
});


/*****************************************************************************
    EXPERIMENT POST REQUEST HANDLERS
******************************************************************************/
app.post('/sendmail', function (req, res)
{
    sendmailexp.sendConfirmation(req.body.username, res);
});

app.post('/update', function (req, res)
{
    updateHandler.updateHandler(req.body.newname, res);
});

app.post('/dynamic', function (req, res)
{
    sendmailexp.sendConfirmation(req.body.username, res);
});

app.post('/cookieset', function (req, res)
{
    res.cookie("TEST-COOKIE", req.body.username);
    res.writeHead(200, {"Content-Type":"text/html"});
    res.write("Cookie Set! :D Chrome Settings > Advanced > Content-Managements > Show cookies");
    res.end();
});


app.use(function(req, res) {
    res.render(basedir + '/views/redirecterror.html',
    {
        'statusCode': 404,
        'error': req.originalUrl
    });
});

// Handle 500
app.use(function(error, req, res, next) 
{
    console.log(error);
    res.render(basedir + '/views/redirecterror.html',
    {
        'statusCode': 500,
        'error': req.originalUrl
    });
});

app.listen(port, ipaddr, function()
{
    console.log("Listening at " + ipaddr + " at port " + port);
});
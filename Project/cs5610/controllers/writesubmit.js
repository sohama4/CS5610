var MongoClient = require('mongodb').MongoClient;
var globalreq = null;
var globalres = null;
var globaldb = null;

var md5 = require('./md5.js')


// URL representation of title
function convertToSlug(Text)
{
    return Text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-')
        ;
}

function collcallback(collection)
{
    /*
    soham-is-the-greatest-ever -> id
    127.0.0.1:8080/user/id/soham.. -> URL
    soham is the greatest ever -> title
    56.. -> user
    */
    var authorName;
    collection.find({username: globalreq.session.username}).toArray(function(err, cursorArray)
    {
        fname = cursorArray[0].fname;
        lname = cursorArray[0].lname;
        authorName = fname + ' ' + lname;
        var title = globalreq.body.title;
        var content = globalreq.body.article;
        var url;
        if(!process.env.OPENSHIFT_MONGODB_DB_URL)
            url = 'http://127.0.0.1:8080/readarticle/user/' + convertToSlug(title);
        else
            url = 'http://' + process.env.OPENSHIFT_APP_DNS + '/readarticle/user/' + convertToSlug(title);
        var time = Number(Math.floor(new Date().getTime()));
        var articleId = convertToSlug(title);
        globaldb.createCollection('WrittenArticles', function(err, collection)
        {
            if(err)
                throw err;
            else
            {
                var insertdoc = {UserID: globalreq.session.userId, articleID: articleId, title: title, content: content, URL: url, Time: time, Author: authorName}; // milliseconds since epoch
                collection.find({URL: url}).count(function(err, countEntries)
                {
                    switch(countEntries)
                    {
                        case 0:
                            // no articles in the Articles collection with these identifiers
                            collection.insert(insertdoc, {w:1}, function(err, result)
                            {
                                if(err)
                                {
                                    console.log('Error in collection: WrittenArticles');
                                    globalres.sendfile(basedir + '/views/error.html');
                                    throw err;
                                }
                                else
                                {
                                    // insert in WrittenArticles successful!
                                    console.log("Article created!");
                                    globalres.render(basedir + '/views/createSuccess.html', 
                                    {
                                        'articleUrl': url
                                    });
                                }
                            });
                            break;
                        default:
                            globalres.render(basedir + '/views/write.html', 
                            {
                                'errors': 'You have already written an article with the same title!'
                            });
                            break;
                    }
                });
            }
        });
    });
}

function dbcallback(db)
{
    globaldb = db;
    db.createCollection('RegisteredUsers', function(err, collection) 
    {
        if (err)
        {
            console.log('Error in collection: RegisteredUsers');
            globalres.sendfile(basedir + '/views/error.html');
            throw err;
        }
        else
            collcallback(collection);
    });
}

// what happens after a POST on the #write form -- follow to find out!
function writesubmit(req, res)
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
        {
            console.log('Error in connection: MongoDB');
            globalres.sendfile(basedir + '/views/error.html');
            throw err;
        }
        else
            dbcallback(db);
    });

}
exports.writesubmit = writesubmit
var settings;
if(process.env.OPENSHIFT_MONGODB_DB_URL)
	settings = {
  	db: 'CS5610;', 
  	host: process.env.OPENSHIFT_MONGODB_DB_HOST, 
  	port: process.env.OPENSHIFT_MONGODB_DB_PORT
	}
else
	settings = {
  	db: 'test;', 
  	host: '127.0.0.1', 
  	port: 27017
	}
  exports.settings = settings
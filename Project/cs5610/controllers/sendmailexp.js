var nodemailer = require('nodemailer');


function sendConfirmation(username, res)
{
	// create reusable transporter object using SMTP transport

	var htmlbody = '!<br>Thank you for trying out nodemailer!<br><br>Happy surfing! :)</p>';
	var transporter = nodemailer.createTransport(
	{
	    service: 'Gmail',
	    auth: {
	        user: 'soham9015@gmail.com',
	        pass: 'whatagreatpassword'
	    }
	});

	// NB! No need to recreate the transporter object. You can use
	// the same transporter object for all e-mails

	// setup e-mail data with unicode symbols
	var mailOptions = 
	{
	    from: "Nodemailer - Test <soham9015@gmail.com>", // sender address
	    to: username, // list of receivers
	    subject: 'Thank you for registering!', // Subject line
	    text: 'Hello!',
	    html: '<p>Hello<b>' + htmlbody // html body
	};

	// send mail with defined transport object
	transporter.sendMail(mailOptions, function(err, info)
	{
	    if(err)
	        console.log(err);
	    else
	        console.log('Message sent: ' + info.response);
	});

	res.writeHead(200, {"Content-Type":"text/html"});
	res.write("Check your inbox! :D");
	res.end();
}



exports.sendConfirmation = sendConfirmation
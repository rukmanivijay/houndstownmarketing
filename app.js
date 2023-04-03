var http = require('http');
var url = require('url');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;

var mongoDB = 'mongodb://127.0.0.1:27017/houndtownmarketing';
var dbUrl = "mongodb://127.0.0.1:27017/";

function connectToDatabase(ip) {
	
	var ipValue = ip;

	mongoose.connect(mongoDB);

	mongoose.Promise = global.Promise;

	var db = mongoose.connection;

	db.on( 'connected',function() {
		console.log('Mongoose default connection done');
	});

	db.on( 'error',function(err) {
		console.log('Mongoose default connection failed' +err);
	});

	MongoClient.connect(dbUrl, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("houndtownmarketing");

	  var myobj;
	  var ip,city,lat,longi,date_time;
	  
	  var url = "https://ipapi.co/"+ipValue+"/json";
 
	  var newDate = new Date();
	  var offset = -300;
	  var dateString = new Date(newDate.getTime() + offset*60*1000).toUTCString();
	  

	 // fetch is an API
	fetch(url)
	    .then(response=>response.json())
	    .then((responseJson=>{

			ip = responseJson.ip;
			city = responseJson.city;
			lat = responseJson.latitude;
			longi = responseJson.longitude;
			date_time = dateString;
			myobj = { IP: ip, City: city, Latitude: lat, Longitude: longi, Date_Time: date_time };


			//connnecting to the database
		  	dbo.collection("trackinguser").insertOne(myobj, function(err, res) {
			    if (err) throw err;
			    console.log("1 document inserted");
			    db.close();
			});
			
	    }))

	});

}

http.createServer(function (req, res) {

  //var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || null;
  var ip = req.connection.remoteAddress;
  //var ip ="::ffff:124.89.86.225";
  //console.log( ip );
  var startPosition = ip.lastIndexOf(":")+1;
  ip = ip.slice(startPosition);
  //console.log(ip);

  var q = url.parse(req.url, true);
  var filename = "." + q.pathname;
  console.log(filename);

  if(filename==="./userinfo"){

  	console.log("userinfo");

			MongoClient.connect(dbUrl, function(err, db) {

			  if (err) throw err;
			  
			  var dbo = db.db("houndtownmarketing");
			  var query = { City: "Cincinnati" };
			  dbo.collection("trackinguser").find({}).toArray(function(err, result) {
			    if (err) throw err;
			    
			    res.writeHead(200, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify(result));

			    db.close();
			    return res.end();
			  });
			});

  }else{
	  	
	  	fs.readFile(filename, function(err, data) {

	      connectToDatabase(ip);
	      console.log('connecting to database');
	      res.writeHead(200, {'Content-Type': 'text/html'});
	      res.writeHead(301, { Location: "https://houndstownusa.com/locations/cincinnati-madisonville/" });
	      return res.end();

	  });
  }
  

}).listen(8080);

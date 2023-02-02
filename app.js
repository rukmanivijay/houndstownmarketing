var http = require('http');
var fs = require('fs');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;


var mongoDB = 'mongodb://localhost:27017/houndtownmarketing';
var url = "mongodb://localhost:27017/";
mongoose.connect(mongoDB);

mongoose.Promise = global.Promise;

var db = mongoose.connection;

db.on( 'connected',function() {
	console.log('Mongoose default connection done');
});

db.on( 'error',function(err) {
	console.log('Mongoose default connection failed' +err);
});

function connection() {

	MongoClient.connect(url, function(err, db) {
	  if (err) throw err;
	  var dbo = db.db("houndtownmarketing");

	  var myobj;
	  var ip,city,lat,longi;

	 // fetch is an API
	fetch("https://ipapi.co/json/")
	    .then(response=>response.json())
	    .then((responseJson=>{

			ip = responseJson.ip;
			city = responseJson.city;
			lat = responseJson.latitude;
			longi = responseJson.longitude;
			myobj = { IP: ip, City: city, Latitude: lat, Longitude: longi};


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
	connection();
	res.writeHead(301, { Location: "https://houndstownusa.com/locations/cincinnati-madisonville/" });
	return res.end();
}).listen(8080);
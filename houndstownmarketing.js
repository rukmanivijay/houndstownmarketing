var http = require('http');
var fs = require('fs');
//var mongo = require('mongodb');

var ip,city,lat,longi;

// fetch is an API
fetch("https://ipapi.co/json/")
    .then(response=>response.json())
    .then((responseJson=>{
        //console.log(responseJson)
		ip = responseJson.ip;
		city = responseJson.city;
		lat = responseJson.latitude;
		longi = responseJson.longitude;
		
        // console.log("IP: "+ responseJson.ip)
        // console.log("City: "+ responseJson.city)
        // console.log("Lat: "+ responseJson.latitude)
        // console.log("Long: "+ responseJson.longitude)
    }))

http.createServer(function (req, res) {
	
	// res.write(fd.fetchDataIP());
	// res.write(fd.city());
	// res.write(fd.lat());
	// res.write(fd.longi());
	// fetch("https://ipapi.co/json/")
    // .then(response=>response.json())
    // .then((responseJson=>{
        // console.log(responseJson)
        // console.log("IP: "+ responseJson.ip)
        // console.log("City: "+ responseJson.city)
        // console.log("Lat: "+ responseJson.latitude)
        // console.log("Long: "+ responseJson.longitude)
    // }))
	
	console.log(ip);
	
	// var MongoClient = mongo.MongoClient;

	// var url = 'mongodb://localhost:27017';

	// MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
	
	// console.log('entry inserted');

    // if (err) throw err;
	
	// const db = client.db("houndstownmarketing");

    // let doc = {_id: new ObjectID(), name: "Toyota", price: 37600 };

    // db.collection('trackinguser').insertOne(doc).then((doc) => {

        // console.log('entry inserted');
        // console.log(doc);
    // }).catch((err) => {

        // console.log(err);
    // }).finally(() => {

        // client.close();
    // });
	// });
	
	
    fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);
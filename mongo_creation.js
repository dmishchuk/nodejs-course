var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, { useNewUrlParser: true }).then(function(err, db) {
	console.log(123);
  if (err) throw err;
  var dbo = db.db("mydb");
  dbo.createCollection("cities", function(err, res) {
    if (err) throw err;
    console.log("Collection cities created!");
    db.close();
  });
  var myobj = {
  	name: "Brest",
  	country: "Belarus",
  	capital: false,
  	location: {
  		lat: 52.097621,
  		long: 23.734050
  	}
  };
  dbo.collection("cities").insertOne(myobj, function(err, res) {
    if (err) throw err;
    console.log("1 city inserted");
    db.close();
  });
});
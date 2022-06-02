var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("local");
    var myobj = { name: "UBC", address: "Broadway 5602" };
    // dbo.collection("customers").insertOne(myobj, function(err, res) {
    //     if (err) throw err;
    //     console.log("1 document inserted");
    //     db.close();
    // });
    var myquery = { name: "Mickey" };
    var newvalues = { $set: {name: "Mini", address: "Canyon 123" } };
    dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
        if (err) throw err;
        console.log("1 document updated");
        console.log(res);
        //db.close();
    });
    var mysort = { name: 1 };
    dbo.collection("customers").find().sort(mysort).toArray(function(err, result) {
        if (err) {
            return err.message;
        }
        console.log(result);
        db.close();
    });
})
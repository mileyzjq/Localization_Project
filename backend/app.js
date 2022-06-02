const express = require('express');
let router = express.Router();
const cors = require('cors');
const mysql = require("./testMysql");
const app = express()
const bodyParser = require('body-parser')
const port = 3090
const corsOptions ={
    origin:'http://localhost:'+port,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());

app.get('/', (req, res) => {
    mysql.connectDB();
    mysql.checkTable()
        .then(function(result){
            res.send({"data": result, "msg": "check table"});
    }).catch(function(err){res.send({"data":[], "msg": "Error!"})});
})

app.post('/doSearch', (req, res) => {
    mysql.connectDB();
    const target = req.query.searchTerm;
    console.log(target);
    //console.log(req.body.searchTerm);
    const sql = "select * from testDB where value like" + "\"%" + target + "%\"";
    mysql.executeQuery(sql)
        .then(function(result){
            res.send({"data": result, "msg": "search"});
        }).catch(function(err){res.send({"data":[], "msg": "Error!"})});
})

app.post('/insertRows', (req, res) => {
    mysql.connectDB();
    const target = req.query.searchTerm;
    console.log(target);
    //console.log(req.body.searchTerm);
    const sql = "select * from testDB where value like" + "\"%" + target + "%\"";
    mysql.executeQuery(sql)
        .then(function(result){
            res.send({"data": result, "msg": "search"});
        }).catch(function(err){res.send({"data":[], "msg": "Error!"})});
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
app.use(bodyParser.json());

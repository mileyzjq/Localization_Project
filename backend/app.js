const path = require('path');
const express = require('express');
let router = express.Router();
const cors = require('cors');
const mysql = require("./testMysql");
const app = express()
const bodyParser = require("body-parser")
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb'}))
const port = 3090
const corsOptions ={
    origin:'http://localhost:'+port,
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors());

require('dotenv').config()

app.post('/insertRows', async(req, res) => {
    const sql1 = "TRUNCATE TABLE `testDB`;";
    await mysql.promisedQuery(sql1, []);
    console.log("token: " + process.env.gitlabApiToken);
    const entry = req.body.data;
    const list = entry.split("\n");
    let rows = [];
    list.forEach((item) => {
        const ikey = item.slice(0, item.indexOf('='));
        const ivalue = item.slice(item.indexOf('=') + 1);
        if(ikey !== null && ikey !== undefined && ikey !=="") {
            rows.push([ikey, ivalue]);
        }
    });
    const sql = "INSERT INTO `testDB` (`key`, `value`) VALUES ?";
    mysql.promisedQuery(sql, [rows])
        .then(function(result){
            console.log(result);
            res.send({"status": "success"})
        }).catch(function(err){
            console.log(err.message);
            res.send({"data": err, "status": "error"})
        });
})

app.get('/doSearchAll', async(req, res) => {
    const sql = "select * from testDB;";
    mysql.promisedQuery(sql, [])
        .then(function(result){
            res.send({"data": result, "status": "success" });
        }).catch(function(err){
        res.send({"data":err, "status": "error"})
    });
})

app.get('/newFiles', async(req, res) => {
    let fileString = "";
    const sql = "SELECT * FROM `testDB` ORDER BY BINARY `key` ASC;";
    mysql.promisedQuery(sql, [])
        .then(function(result){
            result.forEach(item => {
                fileString += item.key + "=" + item.value + "\n";
            });
            res.send(fileString);
        }).catch(function(err){res.send("File to generate new file!")});
});

app.post('/translations',async(req, res) => {
    const languages = (await LanguagesDao.list()).map(language => language.code);
    console.log(languages);
    const branch = "Jiaqi_test";
    const files = await getAllFiles(branch);
    //console.log(params);
    const sql1 = "TRUNCATE TABLE `Translations`;";
    await mysql.promisedQuery(sql1, []);
    await processTranslationFiles(files, 1);
});

app.post('/table/delete', async(req, res) => {
    const key = req.body.key;
    const sql = "DELETE FROM testDB WHERE `key` = ?";
    console.log(sql);
    mysql.promisedQuery(sql, [key])
        .then(function(result){
            console.log(result);
            res.send({"status": "success"});
        }).catch(function(err){
            console.log(err.message);
            res.send({"error": err.message, "status": "error"});
    });
});

app.post('/table/add', async(req, res) => {
    const key = req.body.key;
    const sql = "INSERT INTO testDB (`key`, `value`) VALUES ?";
    console.log(sql);
    mysql.promisedQuery(sql, [[[key, '']]])
        .then(function(result){
            console.log(result);
            res.send({"status": "success"});
        }).catch(function(err){
        console.log(err.message);
        res.send({"error": err.message, "status": "error"});
    });
});

app.post('/table/save', async(req, res) => {
    const item = req.body.row;
    console.log(item);
    const sql = "UPDATE testDB SET `key` = ?, `value` = ? WHERE `id` = ?;";
    mysql.promisedQuery(sql, [item.key, item.value, item.id])
        .then(function(result){
            console.log(result);
            res.send({"status": "success"});
        }).catch(function(err){
        console.log(err.message);
        res.send({"error": err.message, "status": "error"});
    });
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
app.use(bodyParser.json());

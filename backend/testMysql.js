var mysql = require('mysql');

var con = mysql.createConnection({
    host: "127.0.0.1",
    port: 3307,
    database: "hello",
    user: "root",
    password: "zjq123456"
});

async function connectDB() {
    con.connect(function(err) {
        if (err) {
            console.log(err.message);
        } else {
            console.log("Connected!");
        }
    });
}

connectDB();

let promisedQuery = function (queryString, parameters, resultTransformer) {
    return new Promise(function (resolve, reject) {
        con.query(queryString, parameters, function (err, result) {
            if (err) {
                reject(err);
            } else {
                if (resultTransformer) {
                    resolve(resultTransformer(result));
                } else {
                    resolve(result);
                }
            }
        })
    })
};

const checkTable = async() => {
    const sql = "SELECT * FROM `testDB`";
    return executeQuery(sql);
}

//checkTable();
module.exports = {
    "connectDB": connectDB,
    "checkTable": checkTable,
    "promisedQuery": promisedQuery
};

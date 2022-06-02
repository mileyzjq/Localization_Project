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

async function executeQuery(sql, msg) {
    return new Promise(function (resolve, reject) {
        con.query(sql, function (err, result) {
            if (err) {
                console.log(err.message);
                reject(err.message);
            } else {
                if(msg) console.log(msg);
                if (result) {
                    resolve(result);
                }
            }
        });
    });
}

async function createTable() {
    const sql = "CREATE TABLE `testDB` (`id` INT NOT NULL AUTO_INCREMENT, `key` VARCHAR(45) NULL,`name` VARCHAR(45) NULL, PRIMARY KEY (`id`));";
    //const sql = "CREATE TABLE testDB (sid INT NOT NULL AUTO_INCREMENT, key VARCHAR(255), value VARCHAR(255), PRIMARY KEY (sid));";
    const msg = "CREATE A TABLE SUCCESSFULLY!";
    executeQuery(sql, msg);
}


//createTable();

async function insertRows() {
    const rows  = "('FRED', 'Fred'), ('JOHN', 'John'), ('MICHEAL', 'Michael'), ('SMITH', 'Smith'), ('APPLE', 'apple')," +
        "('MELON', 'melon'), ('BANANA', 'banana'), ('PEAR', 'pear'), ('TIME', 'time'), ('PLACE', 'place')";
    const sql = "INSERT INTO `testDB`  (`key`, `name`) VALUES " + rows;
    const msg = "INSERT ROWS SUCCESSFULLY!";
    executeQuery(sql, msg);
}

//insertRows();

const checkTable = async() => {
    const sql = "SELECT * FROM `testDB`";
    return executeQuery(sql);
}

//checkTable();
module.exports = {
    "connectDB": connectDB,
    "checkTable": checkTable,
    "executeQuery": executeQuery
};

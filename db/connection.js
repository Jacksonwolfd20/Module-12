const mysql = require("mysql2");
const colors = require("colors");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "Junior101",
    database: "business_db",
  },
  console.log(`Connected`.green)
);

module.exports = db;

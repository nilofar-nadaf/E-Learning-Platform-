const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Nilofar@2005",
  database: "E_LEARNING_PLATFORM",
});

module.exports = pool;

// Database Module
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  // port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'YourPasswordHere',
  database: 'employee_trackerDB'
});

// Open a connection when running in API and server mode; commented out for CLI mode
// connection.connect(err => {
//   if (err) throw err;
//   console.log('connected as id ' + connection.threadId);
// });

module.exports = connection;
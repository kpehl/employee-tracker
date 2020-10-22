// Server for the Employee Tracker Application
// Dependencies
// Express.js
const express = require('express');
// Database module
const connection = require('./db/database');
// API Routes
const apiRoutes = require('./routes/apiRoutes');


// Define the port and initialize the server
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware to parse strings and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Middleware to point to the API Routes folder.
// Predefine the api prefix on the route expressions since it will be used every time.
// Node.js will look for the index.js file. If one didn't exist, specify the file here.
app.use('/api', apiRoutes)

// Verify that the server is running with an HTML Route
app.get('/', (req,res) => {
    res.json({
        message: 'Server running'
    });
});

// 404 Resource Not Found Route
// Default response for any other request(Not Found) Catch-all
// (Place after all other routes so it does not override)
app.use((req,res) => {
    res.status(404).end();
});

// // Start the server only after the connection to the database is established
connection.on('connect', () => {
    // Listen on the specified port when the server is running
    app.listen(PORT, () => {
        console.log(`Server running on port ${ PORT }`);
    });
});
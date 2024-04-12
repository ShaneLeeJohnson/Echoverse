// Import the Express library to create the server application
const express = require('express');
// Import the connection to the database defined in config/connection.js
const db = require('./config/connection');
// Import the routes defined in the routes/index.js file
const routes = require('./routes');

// Define the port number to listen on (default 3001)
const PORT = 3001;
// Create an Express application instance
const app = express();

// Configure middleware to parse incoming request data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded form data
app.use(express.json()); // Parse incoming JSON data
// Mount the imported routes onto the Express application
app.use(routes);

// Connect to the database using the imported connection object
db.once('open', () => {
    // Start the server listening on the defined port
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}!`);
    });
});
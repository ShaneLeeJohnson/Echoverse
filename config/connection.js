// Import necessary objects from the 'mongoose' library
const {connect, connection} = require('mongoose');

// Establish a connection to the MongoDB database
connect('mongodb://127.0.0.1:27017/echoverse');

// Export the 'connection' object to be used in other parts of the application
module.exports = connection;
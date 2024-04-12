// Import the Router object from the Express library
const router = require('express').Router();
// Import the API routes from a separate file named './api/index.js'
const apiRoutes = require('./api');

// Mount (attach) the imported API routes at the '/api' path on the main router
router.use('/api', apiRoutes);

// Export the configured router object to be used in other parts of the application
module.exports = router;
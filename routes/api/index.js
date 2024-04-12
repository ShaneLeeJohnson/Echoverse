// Import the Express Router object
const router = require('express').Router();
// Import the user routes from a separate file (userRoutes.js)
const userRoutes = require('./userRoutes');
// Import the thought routes from a separate file (thoughtRoutes.js)
const thoughtRoutes = require('./thoughtRoutes');

// Mount (attach) the user routes at the '/users' path
router.use('/users', userRoutes);
// Mount (attach) the thought routes at the '/thoughts' path
router.use('/thoughts', thoughtRoutes);

// Export the router object for use in the main server file
module.exports = router;
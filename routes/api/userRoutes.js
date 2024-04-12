// Import the Express Router function and assign it to a constant named "router"
const router = require('express').Router();
// Import the User model from the '../../models/User' file
const User = require('../../models/User');
// Import the Thought and Reaction models from the '../../models/Thought' file
const { Thought, Reaction } = require('../../models/Thought');

// Route to get all users
router.get('/', async (req, res) => {
    try {
        // Attempt to find all user documents from the database
        const users = await User.find()
            .select('-__v'); // Exclude the '__v' property (version number) from the response for efficiency
        res.json(users); // Send the array of user documents as JSON data in the response
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Route to get a user by its id
router.get('/:userId', async (req, res) => {
    try {
        // Attempt to find a user document by ID from the database
        const user = await User.findById(req.params.userId)
            .select('-__v') // Exclude the '__v' property (version number) from the response for efficiency
            .populate('thoughts') // Populate the user document with referenced thought documents
            .populate('friends'); // Populate the user document with referenced friend documents
        // Check if the user was found
        if (!user) {
            // User not found, send a 404 error and exit the function early
            res.status(404).json({ message: 'User not found!' });
            return;
        }
        // User found, send the user document in the response
        res.json(user);
    } catch (err) {
        // Handle errors by logging them and sending a 500 error
        console.error(err);
        res.status(500).json(err);
    }
});

// Route to create a new user
router.post('/', async (req, res) => {
    try {
        // Create a new user document using the data from the request body
        const newUser = await User.create(req.body);
        // Send the newly created user document in the response as JSON data
        res.json(newUser);
    } catch (err) {
        // Handle errors by sending a 400 Bad Request and the error message
        res.status(400).json(err);
    }
});

// Route to update a user
router.put('/:userId', async (req, res) => {
    try {
        // Attempt to update a user document by ID using data from the request body
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
        );
        // Check if the user was found and updated
        if (!updatedUser) {
            // User not found, send a 404 error and exit the function early
            return res.status(404).json({ message: 'User not found!' });
        }
        // User updated, send the updated user document in the response
        res.json(updatedUser);
    } catch (err) {
        // Handle errors by sending a 400 Bad Request and the error message
        res.status(400).json(err);
    }
});

// Route to delete a user
router.delete('/:userId', async (req, res) => {
    try {
        // Attempt to find and delete a user document by ID
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        // Check if the user was found and deleted
        if (!deletedUser) {
            // User not found, send a 404 error and exit the function early
            return res.status(404).json({ message: 'User not found!' });
        }
        // User deleted, proceed to delete associated thoughts
        await Thought.deleteMany({ username: deletedUser.username });
        // Send a success message in the response
        res.json({ message: 'User and associated thoughts deleted!' });
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Route to add a friend to the users friends list
router.post('/:userId/friends/:friendId', async (req, res) => {
    try {
        // Extract user ID and friend ID from request parameters
        const userId = req.params.userId;
        const friendId = req.params.friendId;

        // Attempt to find the friend by ID
        const friend = await User.findById(friendId);
        // Check if the friend user was found
        if (!friend) {
            // Friend not found, send a 404 error and exit the function early
            return res.status(404).json({ message: 'Friend not found!' });
        }

        // Update the user's friend list (add friend's ID)
        await User.findByIdAndUpdate(
            userId,
            { $push: { friends: friendId } },
            { new: true }
        );

        // Update the friend's friend list (add user's ID)
        await User.findByIdAndUpdate(
            friendId,
            { $push: { friends: userId } },
            { new: true }
        );

        // Send a success message in the response
        res.json({ message: 'Friend added successfully!' });
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Route to delete a friend from a users friends list
router.delete('/:userId/friends/:friendId', async (req, res) => {
    try {
        // Extract user ID and friend ID from request parameters
        const userId = req.params.userId;
        const friendId = req.params.friendId;

        // Update the user's friend list (remove friend's ID)
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $pull: { friends: friendId } },
            { new: true }
        );

        // Update the friend's friend list (remove user's ID)
        await User.findByIdAndUpdate(
            friendId,
            { $pull: { friends: userId } },
            { new: true }
        );

        // Check if the user was found during the update
        if (!updatedUser) {
            // User not found, send a 404 error and exit the function early
            return res.status(404).json({ message: 'User not found!' });
        }

        // Send a success message in the response
        res.json({ message: 'Friend removed successfully!' });
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Export the router to be used in index.js
module.exports = router;
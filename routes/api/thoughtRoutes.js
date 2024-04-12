// Import the Router object from Express
const router = require('express').Router();
// Import Thought and Reaction models from the '../../models/Thought.js file'
const { Thought, Reaction } = require('../../models/Thought');
// Import the User model from the '../../models/User.js file'
const User = require('../../models/User');

// Route to get all thoughts (GET /)
router.get('/', async (req, res) => {
    try {
        // Find all thought documents
        const thoughts = await Thought.find()
            .select('-__v') // Exclude the `__v` property (version number) from the response for efficiency
            .populate('reactions'); // Populate the `reactions` array with the associated Reaction documents
        res.json(thoughts); // Send the fetched thoughts as JSON data in the response
    } catch (err) {
        res.status(500).json(err); // Handle errors by sending a 500 Internal Server Error and the error message
    }
});

// Route to get a single thought by its id
router.get('/:thoughtId', async (req, res) => {
    try {
        // Find a thought by its ID
        const thought = await Thought.findById(req.params.thoughtId)
            .select('-__v') // Exclude the `__v` property (version number) from the response for efficiency
            .populate('reactions'); // Populate the `reactions` array with the associated Reaction documents
        if (!thought) {
            // Thought not found, send a 404 error and exit
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }
        // Thought found, send it in the response
        res.json(thought);
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Route to post a new thought
router.post('/', async (req, res) => {
    try {
        // Extract thoughtText, username, and userId from the request body
        const { thoughtText, username, userId } = req.body;

        // Check for missing required fields
        if (!thoughtText || !username) {
            // Send a 400 error for missing required fields
            return res.status(400).json({ message: 'Missing required fields!' });
        }

        // Create a new thought document
        const newThought = await Thought.create({ thoughtText, username });

        // Update the user document to include the new thought's ID
        const user = await User.findByIdAndUpdate(
            userId,
            { $push: { thoughts: newThought._id } },
            { new: true }
        );

        // Check if the user was found
        if (!user) {
            // Send a 404 error if the user wasn't found
            return res.status(404).json({ message: 'User not found!' });
        }

        // Send the newly created thought in the response
        res.json(newThought);
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(400).json(err);
    }
});

// Route for updating a thought
router.put('/:thoughtId', async (req, res) => {
    try {
        // Find a thought by ID and update it with the request body
        const updatedThought = await Thought.findByIdAndUpdate(
            req.params.thoughtId,
            req.body,
            { new: true }
        );

        // Check if the thought was found and updated
        if (!updatedThought) {
            // Thought not found, send a 404 error and exit
            return res.status(404).json({ message: 'Thought not found!' });
        }
        // Thought updated, send it in the response
        res.json(updatedThought);
    } catch (err) {
        // Handle errors by sending a 400 Bad Request and the error message
        res.status(400).json(err);
    }
});

// Route for deleting a thought
router.delete('/:thoughtId', async (req, res) => {
    try {
        // Extract the thought ID from the request parameters
        const thoughtId = req.params.thoughtId;

        // Find the thought by ID and delete it
        const deletedThought = await Thought.findByIdAndDelete(thoughtId);

        // Check if the thought was found and deleted
        if (!deletedThought) {
            // Thought not found, send a 404 error and exit
            return res.status(404).json({ message: 'Thought not found!' });
        }

        // Update the user to remove the deleted thought from their thoughts array
        const updatedUser = await User.findOneAndUpdate(
            { thoughts: thoughtId }, // Find users with the thought in their thoughts array
            { $pull: { thoughts: thoughtId } }, // Remove the thought from the thoughts array
            { new: true } // Return the updated user document
        );

        // Send a success message regardless of whether the user was updated (thought is deleted regardless)
        res.json({ message: 'Thought deleted successfully!' });
    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        // Send a 500 Internal Server Error with a generic error message
        res.status(500).json({ message: 'Error deleting thought!' });
    }
});

// Route for posting a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
    try {
        // Extract thought ID from request parameters and reaction data from request body
        const thoughtId = req.params.thoughtId;
        const reactionBody = req.body;

        // Create a new reaction document from the request body
        const newReaction = new Reaction(reactionBody);
        await newReaction.save(); // Save the new reaction to the database

        // Update the thought to include the new reaction's ID
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $push: { reactions: newReaction._id } },
            { new: true }
        );

        // Check if the thought was found and updated
        if (!updatedThought) {
            // Thought not found, send a 404 error and exit
            return res.status(404).json({ message: 'Thought not found!' });
        }

        // Send a success message and the newly created reaction
        res.json({ message: 'Reaction created successfully!', reaction: newReaction });
    } catch (err) {
        // Log the error for debugging purposes
        console.error(err);
        // Send a 400 Bad Request with the error message
        res.status(400).json(err);
    }
});

// Route to delete a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
    try {
        // Extract thought ID and reaction ID from request parameters
        const thoughtId = req.params.thoughtId;
        const reactionId = req.params.reactionId;

        // Update the thought to remove the reaction by ID
        const updatedThought = await Thought.findByIdAndUpdate(
            thoughtId,
            { $pull: { reactions: reactionId } },
            { new: true }
        );

        // Check if the thought was found and updated
        if (!updatedThought) {
            // Thought not found, send a 404 error and exit
            return res.status(404).json({ message: 'Thought not found!' });
        }

        // Delete the reaction by ID
        await Reaction.findByIdAndDelete(reactionId);

        // Send a success message regardless of reaction deletion outcome
        res.json({ message: 'Reaction removed successfully!' });
    } catch (err) {
        // Handle errors by sending a 500 Internal Server Error and the error message
        res.status(500).json(err);
    }
});

// Exports the router to be used in the index.js file
module.exports = router;
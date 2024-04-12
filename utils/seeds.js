// Import required modules
const mongoose = require('mongoose'); // Mongoose ODM library for interacting with MongoDB
const User = require('../models/User'); // mport the User model from the 'models' directory
const Thought = require('../models/Thought'); // Import the Thought model from the 'models' directory

// Define the connection URI for MongoDB
const connectionURI = 'mongodb://127.0.0.1:27017/echoverse';

// Connect to MongoDB using Mongoose
mongoose.connect(connectionURI)
    .then(() => console.log('Connected to MongoDB!')) // Log success message on successful connection
    .catch(err => console.error(err)); // Log any errors that occur during connection

// Define some sample user data for seeding
const seedUsers = [
    {
        username: 'michaelscott',
        email: 'worldsbestboss@dm.com'
    },
    {
        username: 'dumbledore',
        email: 'dumbledore@hogwarts.edu'
    },
];

// Define some sample thought data for seeding
const seedThoughts = [
    {
        thoughtText: `That's what she said!`,
        username: 'michaelscott',
    },
    {
        thoughtText: 'Hogwarts is a magical place!',
        username: 'dumbledore',
    },
];

// Asynchronous function to seed the database
const seedDatabase = async () => {
    // Clear existing users and thoughts from the collections
    await User.deleteMany({});
    await Thought.deleteMany({});
    // Seed the User collection with sample data
    await User.insertMany(seedUsers);
    // Fetch all users from the User collection
    const users = await User.find();

    // Loop through each user
    for (const user of users) {
        // Pick a random thought from the seed data
        const randomThought = seedThoughts[Math.floor(Math.random() * seedThoughts.length)];
        // Create a new Thought document with the random thought and user's username
        const thought = new Thought({ ...randomThought, username: user.username });
        // Save the new thought document to the database
        await thought.save();
        // Push the thought's ID to the user's 'thoughts' array
        user.thoughts.push(thought._id);
        // Save the updated user document with the new thought reference
        await user.save();
    }

    // Log a success message after seeding
    console.log('Database seeded successfully!');
};

// Call the seedDatabase function and then close the MongoDB connection
seedDatabase().then(() => {
    mongoose.connection.close();
});
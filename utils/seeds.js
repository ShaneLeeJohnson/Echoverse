const mongoose = require('mongoose');
const User = require('../models/User');
const Thought = require('../models/Thought');

const connectionURI = 'mongodb://127.0.0.1:27017/echoverse';

mongoose.connect(connectionURI)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error(err));

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

const seedDatabase = async () => {
    await User.deleteMany({});
    await Thought.deleteMany({});
    await User.insertMany(seedUsers);
    const users = await User.find();

    for (const user of users) {
        const randomThought = seedThoughts[Math.floor(Math.random() * seedThoughts.length)];
        const thought = new Thought({ ...randomThought, username: user.username });
        await thought.save();
        user.thoughts.push(thought._id);
        await user.save();
    }

    console.log('Database seeded successfully!');
};

seedDatabase().then(() => {
    mongoose.connection.close();
});
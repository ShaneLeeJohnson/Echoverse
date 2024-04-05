const router = require('express').Router();
const User = require('../../models/User');
const Thought = require('../../models/Thought');

router.get('/', async (req, res) => {
    try {
        const users = await User.find()
            .select('-__v');
        res.json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .select('-__v')
            .populate('thoughts')
            .populate('friends');
        if (!user) {
            res.status(404).json({ message: 'User not found!' });
            return;
        }
        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
    try {
        const newUser = await User.create(req.body);
        res.json(newUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.put('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.userId,
            req.body,
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found!' });
        }
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json(err);
    }
});

router.delete('/:userId', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).json({message: 'User not found!'});
        }
        await Thought.deleteMany({ username: deletedUser.username});
        res.json({message: 'User and associated thoughts deleted!'});
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
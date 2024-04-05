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

module.exports = router;
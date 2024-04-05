const router = require('express').Router();
const Thought = require('../../models/Thought');

router.get('/', async (req, res) => {
    try {
        const thoughts = await Thought.find()
            .select('-__v');
        res.json(thoughts);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:thoughtId', async (req, res) => {
    try {
        const thought = await Thought.findById(req.params.thoughtId)
            .select('-__v')
            .populate('reactions');
        if (!thought) {
            res.status(404).json({ message: 'Thought not found!' });
            return;
        }
        res.json(thought);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;
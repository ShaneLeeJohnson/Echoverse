const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');

const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: true,
            minlength: 1,
            maxlength: 280,
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => formattedDate(timestamp),
        },
        username: {
            type: String,
            required: true,
        },
        reactions: [reactionSchema],
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

function formattedDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    const hours = date.getHours() % 12 || 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const amPm = date.getHours() < 12 ? 'AM' : 'PM';

    return `${day}/${month}/${year} ${hours}:${minutes} ${amPm}`;
}

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
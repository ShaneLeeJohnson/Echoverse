// Import necessary objects from the 'mongoose' library
const { Schema, model, Types } = require('mongoose');

// Define the Schema for a Reaction
const reactionSchema = new Schema(
    {
        // Define the reaction ID property
        reactionId: {
            type: Schema.Types.ObjectId, // Use Mongoose ObjectId data type
            default: () => new Types.ObjectId(), // Generate a new ObjectId by default
        },
        // Define the reaction body property
        reactionBody: {
            type: String, // String data type for the reaction content
            required: true, // Mark this field as required
            maxlength: 280, // Set a maximum length for the reaction body
        },
        // Define the username property
        username: {
            type: String, // String data type for the username
            required: true, // Mark this field as required
        },
        // Define the createdAt property
        createdAt: {
            type: Date, // Use Date data type for the creation timestamp
            default: Date.now, // Set the default value to the current timestamp
            // Define a getter to format the date upon retrieval
            get: (timestamp) => formattedDate(timestamp),
        },
    },
    {
        // Configure options for the schema
        toJSON: {getters: true}, // Include virtual getters in the JSON output
        id: false // Don't include the default Mongoose `_id` property in the output
    }
);

// Create a Mongoose model named 'Reaction' based on the reactionSchema
const Reaction = model('Reaction', reactionSchema);

// Define the Schema for a Thought
const thoughtSchema = new Schema(
    {
        // Define the thoughtText property
        thoughtText: {
            type: String, // String data type for the thought content
            required: true, // Mark this field as required
            minlength: 1, // Set a minimum length for the thought text
            maxlength: 280, // Set a maximum length for the thought text
        },
        // Define the createdAt property
        createdAt: {
            type: Date, // Use Date data type for the creation timestamp
            default: Date.now, // Set the default value to the current timestamp
            // Define a getter to format the date upon retrieval
            get: (timestamp) => formattedDate(timestamp),
        },
        // Define the username property
        username: {
            type: String, // String data type for the username
            required: true, // Mark this field as required
        },
        // Define the reactions property as an array of ObjectIds referencing Reactions
        reactions: [{type: Schema.Types.ObjectId, ref: 'Reaction'}],
    },
    {
        // Configure options for the schema
        toJSON: { virtuals: true, getters: true }, // Include virtual properties and getters in the JSON output
        id: false // Don't include the default Mongoose `_id` property in the output
    }
);

// Define a virtual property 'reactionCount' for Thought schema
thoughtSchema.virtual('reactionCount').get(function () {
    // Getter function to return the length of the reactions array (number of reactions)
    return this.reactions.length;
});

// Function to format a timestamp into a desired date string format
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

// Create a Mongoose model named 'Thought' based on the thoughtSchema
const Thought = model('Thought', thoughtSchema);

// Export both Thought and Reaction models for use in other parts of the application
module.exports = { Thought, Reaction };
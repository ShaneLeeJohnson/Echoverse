// Import necessary objects from the 'mongoose' library
const { Schema, model } = require('mongoose');

// Define the Schema for a User
const userSchema = new Schema(
    {
        // Define the username property
        username: {
            type: String, // String data type for the username
            unique: true, // Enforce unique usernames
            required: true, // Mark this field as required
            trim: true, // Remove leading/trailing whitespace
        },
        // Define the email property
        email: {
            type: String, // String data type for the email address
            unique: true, // Enforce unique email addresses
            required: true, // Mark this field as required
            // Validate email format with a regular expression
            match: [/.+@.+\..+/, 'Please enter a valid email address'],
        },
        // Define the thoughts property as an array of ObjectIds referencing Thoughts
        thoughts: [{ type: Schema.Types.ObjectId, ref: 'Thought' }],
        // Define the friends property as an array of ObjectIds referencing Users
        friends: [{type: Schema.Types.ObjectId, ref: 'User'}],
    },
    {
        // Configure options for the schema
        toJSON: {virtuals: true}, // Include virtual properties in the JSON output
        id: false // Don't include the default Mongoose `_id` property in the output
    }
);

// Define a virtual property 'friendCount' for User schema
userSchema.virtual('friendCount').get(function () {
    // Getter function to return the length of the friends array (number of friends)
    return this.friends.length;
});

// Create a Mongoose model named 'User' based on the userSchema
const User = model('User', userSchema);

// Export the User model for use in other parts of the application
module.exports = User;
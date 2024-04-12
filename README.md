# Echoverse

## Description

Echoverse is a social network API that can be used to create and store Users and their thoughts, reactions to their thoughts, and save other users as their friends.

## Installation

This application requires node.js to run. The user will also have to install all dependencies as well including express and mongoose. The user will also need to install mongodb seperately and can choose to install compass if they want to use a graphic user interface to ensure that their database exists and that documents are created successfully.

## Usage

To see this application in action, please watch the following video:

[Echoverse demo.webm](https://github.com/ShaneLeeJohnson/Echoverse/assets/77424320/88a14997-755e-4137-9d44-6a9cc77e7e17)


To use this application the user will need to open their command line terminal (bash for windows). After ensuring that they have node.js and all dependencies installed, they will enter the command node utils/seeds.js to create the echoverse database and seed it. After the seeding is successful the user will then start the application by running node server.js. Once the server says that it is listening, the user can test the different routes by using insomnia. The user has several different options that they can do using insomnia. There are routes to view, create, update and delete users as well as routes to view, create, update and delete thoughts. There are also routes to add a friend to a users friends list and remove a friend from the list. The last routes the user can test are creating a reaction to a users thought or deleting a reaction to a thought. The route to get all users is http://localhost:3001/api/users. The route for a single user is http://localhost:3001/api/users/:userId where the userId will be the _id property of the specific user that you are trying to view. The route to create a new user is http://localhost:3001/api/users. To create a new user you will need to have a json body with a username and email. The route to update a specific user is http://localhost:3001/api/users/:userId. You can choose either a new username, email, or both when creating the json body to update the user. The route to delete a user is http://localhost:3001/api/users/:userId. The route to get all thoughts is http://localhost:3001/api/thoughts. The route to get a single thought is http://localhost:3001/api/thoughts/:thoughtId where the thoughtId will be the _id property of the specific thought that you are trying to view. The route to create a new thought is http://localhost:3001/api/thoughts. To create a new thought you will need to have a json body with thougtText, username, and userId. The thought text can be whatever the user wants, but the username and userId should reference the username and userId of an existing user in the database. The route to update a thought is http://localhost:3001/api/thoughts/:thoughtId. You can choose to create new thoughtText, a username, or a userID or update all of them when creating the json body to update the thought. The route to delete a thought is http://localhost:3001/api/thoughts/:thoughtId. The route to add a friend to a users friends list is http://localhost:3001/api/users/:userId/friends/:friendId where friendId is the _id of the user you are trying to add to the users friends list. The logic of this post route adds both users to each others friends list. The route to delete a friend from a users friends list is http://localhost:3001/api/users/:userId/friends/:friendId. The logic of this delete route will remove both users from each others friends list. The route to add a reaction to a users thought is http://localhost:3001/api/thoughts/:thoughtId/reactions. The user will need to have a json body that includes the reactionBody which is the text the user wants to react with, and a username which will reference the username of an existing user within the database. The route to delete a reaction to a users thought is http://localhost:3001/api/thoughts/:thoughtId/reactions/:reactionId where the reaction id is the _id of the reaction. The user can test these routes using insomnia and can then call one of the get routes to see the updated data or they can view the documents using mongodb compass if they installed it.

## License

Please refer to the LICENSE in the repo.

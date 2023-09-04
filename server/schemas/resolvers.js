const User = require("./models/User");
const UserLevel = require("./models/Level");
const { signToken } = require("../utils/auth");

const resolvers = {
  Mutation: {
    // create user new mutation
    createUser: async (_, { username, email, password }) => {
      try {
        // create new user and store in user variable
        const user = await User.create({ username, email, password });

        // immediately assign a JWT to the user and log them in once created
        const token = signToken(user);

        // return authentication object that contains the user and their web token
        return { token, user };
      } catch (error) {
        console.error(error);
        throw new Error("Failed to create new user");
      }
    },

    updateUserProgress: async (_, { userId, levelName, levelNumber }) => {
      try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
          throw new Error("User not found");
        }

        // Check if the user has the specified level
        const levelIndex = user.levels.findIndex(
          (level) => level.levelName === levelName
        );

        // ensures that the mutation operation only updates the progress of levels that the user actually has.
        // If the specified level doesn't exist in the user's levels array, it prevents accidental updates or errors related to nonexistent levels.
        if (levelIndex === -1) {
          throw new Error(`Level '${levelName}' not found for the user`);
        }

        // Update the progress for the specified level
        user.levels[levelIndex].levelNumber = levelNumber;

        // Save the updated user
        await user.save();

        return user;
      } catch (error) {
        console.error(error);
        throw new Error("Failed to update progress");
      }
    },
    // delete user's progress function
    deleteUserProgress: async(_, { userId }) => {
      try {
        // find user by _id
        const user = await User.findById(userId)

        // check if user exists
        if(!user){
          throw new Error("No user found");
        }

        // set user level to 0 by using an empty array
        user.level = [];

        // save updated user
        await user.save();

        return "user progress deleted"
      } catch (error) {
        console.error(error)
        throw new Error("Failed to delete progress")
      }
    },
  },
};

module.exports = resolvers;

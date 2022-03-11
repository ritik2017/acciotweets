const express = require('express');
const FollowRouter = express.Router();

const { validateMongoDbUserID } = require('../Utils/Follow');
const User = require('../Models/User');
const { followUser, followingUserList, followerUserList, unfollowUser } = require('../Models/Follow');
const constants = require('../constants');

FollowRouter.post('/follow-user', async (req, res) => {

    const followerUserId = req.body.followerUserId // req.session.user.userId; 
    const followingUserId = req.body.userId;

    // Check Ids are valid
    if(!validateMongoDbUserID(followingUserId)) {
        return res.send({
            status: 400,
            message: "Invalid user id"
        })
    } 

    if(followerUserId === followingUserId) {
        return res.send({
            status: 404,
            message: "You cannot follow yourself"
        })
    }

    // Check whether this user exists in my db

    try {
        const userDb = await User.verifyUserIdExists(followingUserId);

        if(!userDb) {
            return res.send({
                status: 401,
                message: 'No User found'
            })
        }

        // Is the user currently following the user
        // Create a entry in db

        const followDb = await followUser({followerUserId, followingUserId});

        return res.send({
            status: 200,
            message: "User Successfully followed",
            data: followDb
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal Error",
            error: err
        })
    }
})

FollowRouter.get('/following-list/:userId/:offset', async (req, res) => {

    const { userId, offset } = req.params || 0;

    if(!validateMongoDbUserID(userId)) {
        return res.send({
            status: 400,
            message: "UserId Invalid"
        })
    }

    try {
        const userDb = await User.verifyUserIdExists(userId);

        if(!userDb) {
            return res.send({
                status: 401,
                message: 'No User found'
            })
        }

        const followingUserDetails = await followingUserList({followerUserId: userId, offset, limit: constants.FOLLOWLIMIT});
        return res.send({
            status: 200,
            message: "Read Successful",
            data: followingUserDetails
        })
    }
    catch(err) {
        return res.send({
            status: 401,
            message: "Internal error",
            error: err
        })
    }
})


FollowRouter.get('/follower-list/:userId/:offset', async (req, res) => {

    const { userId, offset } = req.params || 0;

    if(!validateMongoDbUserID(userId)) {
        return res.send({
            status: 400,
            message: "UserId Invalid"
        })
    }

    try {
        const userDb = await User.verifyUserIdExists(userId);

        if(!userDb) {
            return res.send({
                status: 401,
                message: 'No User found'
            })
        }

        const followerUserDetails = await followerUserList({followingUserId: userId, offset, limit: constants.FOLLOWLIMIT});
        return res.send({
            status: 200,
            message: "Read Successful",
            data: followerUserDetails
        })
    }
    catch(err) {
        return res.send({
            status: 401,
            message: "Internal error",
            error: err
        })
    }
})

FollowRouter.post('/unfollow-user', async (req, res) => {

    const followerUserId = req.body.followerUserId; // req.session.user.userId;
    const followingUserId = req.body.userId;

    if(!validateMongoDbUserID(followingUserId)) {
        return res.send({
            status: 400,
            message: "UserId Invalid"
        })
    }

    try {
        const followDb = await unfollowUser({followerUserId, followingUserId});
        return res.send({
            status: 200,
            message: "Unfollow Successful",
            data: followDb
        })
    }   
    catch(err) {
        return res.send({
            status: 400,
            message: "Operation unsuccessful",
            error: err
        })
    } 

})

module.exports = FollowRouter;

// User - 100M
// Follow - 1B (100M * 10K)
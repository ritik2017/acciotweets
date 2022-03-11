const constants = require('../constants');
const FollowSchema = require('../Schemas/Follow');
const UserSchema = require('../Schemas/User');
const ObjectId = require('mongodb').ObjectId;

function followUser({followerUserId, followingUserId}) {
    return new Promise(async (resolve, reject) => {

        try {
            const followObj = await FollowSchema.findOne({followerUserId, followingUserId});

            if(followObj) {
                return reject("User already followed");
            }

            const creationDatetime = new Date();

            const follow = new FollowSchema({
                followerUserId,
                followingUserId,
                creationDatetime
            })

            const followDb = await follow.save();
            return resolve(followDb);
        }
        catch(err) {
            return reject(err);
        }

    })
}

// 1. offset 0, 20, 40, 60
// 2. Not pass the offset - Remove Pagination 

// offset 1000

function followingUserList({followerUserId, offset, limit}) {
    return new Promise( async (resolve, reject) => {

        try {
            const followDb = await FollowSchema.aggregate([
                { $match: { followerUserId: ObjectId(followerUserId) } },
                { $sort:  { creationDatetime: -1 } },
                { $project: { followingUserId: 1 } },
                { $facet: { data: [ {"$skip": parseInt(offset)}, { "$limit": limit } ]} }
            ])

            const followingUserIds = [];
            followDb[0].data.forEach((item) => {
                followingUserIds.push(ObjectId(item.followingUserId));
            })

            // ["6ubsjf", "6sybjf", "6usbjs"]

            // await UserSchema.find({_id: {$in: followingUserIds}})
            const followingUserDetails =  await UserSchema.aggregate([
                { $match: { _id: {$in: followingUserIds} }},
                { $project: {
                    username: 1,
                    name: 1,
                    _id: 1
                } }
            ])

            resolve(followingUserDetails);
        }
        catch(err) {
            reject(err);
        }
    })
}

function followingUserIdsList({followerUserId, offset, limit}) {
    return new Promise( async (resolve, reject) => {

        try {
            const followDb = await FollowSchema.aggregate([
                { $match: { followerUserId: ObjectId(followerUserId) } },
                { $sort:  { creationDatetime: -1 } },
                { $project: { followingUserId: 1 } },
                { $facet: { data: [ {"$skip": parseInt(offset)}, { "$limit": limit } ]} }
            ])

            const followingUserIds = [];
            followDb[0].data.forEach((item) => {
                followingUserIds.push(ObjectId(item.followingUserId));
            })
            resolve(followingUserIds);
        }
        catch(err) {
            reject(err);
        }
    })
}


function followerUserList({followingUserId, offset, limit}) {
    return new Promise( async (resolve, reject) => {

        try {

            const followDb = await FollowSchema.aggregate([
                { $match: { followingUserId: ObjectId(followingUserId) } },
                { $sort:  { creationDatetime: -1 } },
                { $project: { followerUserId: 1 } },
                { $facet: { data: [ {"$skip": parseInt(offset)}, { "$limit": limit } ]} }
            ])

            const followerUserIds = [];
            followDb[0].data.forEach((item) => {
                followerUserIds.push(ObjectId(item.followerUserId));
            })

            // ["6ubsjf", "6sybjf", "6usbjs"]

            // await UserSchema.find({_id: {$in: followingUserIds}})
            const followerUserDetails =  await UserSchema.aggregate([
                { $match: { _id: {$in: followerUserIds} }},
                { $project: {
                    username: 1,
                    name: 1,
                    _id: 1
                } }
            ])

            resolve(followerUserDetails);
        }
        catch(err) {
            reject(err);
        }
    })
}

function unfollowUser({followingUserId, followerUserId}) {
    return new Promise(async (resolve, reject) => {

        try {
            const followDb = await FollowSchema.findOneAndDelete({followerUserId, followingUserId});

            // FollowingUserId does not belong to any user
            // User is not followed
            
            if(!followDb) {
                return reject("User not followed");
            }

            return resolve(followDb);
        }
        catch(err) {
            return reject(err);
        }

    })
}


module.exports = { followUser, followingUserList, followerUserList, unfollowUser, followingUserIdsList };
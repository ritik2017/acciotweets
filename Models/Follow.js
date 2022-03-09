const constants = require('../constants');
const FollowSchema = require('../Schemas/Follow');
const UserSchema = require('../Schemas/User');
const ObjectId = require('mongodb').ObjectId;

function followUser({followerUserId, followingUserId}) {
    return new Promise(async (resolve, reject) => {

        try {
            const followObj = await FollowSchema.findOne({followerUserId, followingUserId});

            if(followObj) {
                reject("User already followed");
            }

            const creationDatetime = new Date();

            const follow = new FollowSchema({
                followerUserId,
                followingUserId,
                creationDatetime
            })

            const followDb = await follow.save();
            resolve(followDb);
        }
        catch(err) {
            reject(err);
        }

    })
}

function followingUserList({followerUserId, offset}) {
    return new Promise( async (resolve, reject) => {

        try {

            const followDb = await FollowSchema.aggregate([
                { $match: { followerUserId } },
                { $sort:  { creationDatetime: -1 } },
                { $project: { followingUserId: 1 } },
                { $facet: { data: [ {$skip: offset}, { $limit: constants.FOLLOWLIMIT } ]} }
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

// 1. id api
// 2. 

module.exports = { followUser, followingUserList };

// Aniket -> Shubham
// FollowerUser -> FollowingUser
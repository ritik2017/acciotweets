const  { followingUserIdsList } = require('../Models/Follow');
const constants = require('../constants');

async function getFeedFollowingList(userId) {
    const followingUserIds = [];
    const tempFollowingList = [];
    let offset = 0;

    do {
        tempFollowingList = await followingUserIdsList({followerUserId: userId, offset, limit: constants.FEEDFOLLOWLIMIT });
        offset += tempFollowingList.length;
        followingUserIds = [...followingUserIds, ...tempFollowingList];
    }
    while(tempFollowingList.length < constants.FEEDFOLLOWLIMIT);

    return followingUserIds;
}

module.exports = { getFeedFollowingList };
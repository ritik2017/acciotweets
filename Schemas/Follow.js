const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FollowSchema = new Schema({
    followingUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    followerUserId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    creationDatetime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('tb_follow', FollowSchema);
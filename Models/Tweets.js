const TweetsSchema = require('../Schemas/Tweets');

const constants = require('../constants');

class Tweets {

    title;
    bodyText;
    userId;
    creationDatetime;
    tweetId;

    constructor({title, bodyText, userId, creationDatetime, tweetId}) {
        this.title = title;
        this.bodyText = bodyText;
        this.creationDatetime = creationDatetime;
        this.userId = userId;
        this.tweetId = tweetId;
    }

    createTweet() {
        return new Promise(async (resolve, reject) => {
            this.title.trim();
            this.bodyText.trim();

            const tweet = new TweetsSchema({
                title: this.title,
                bodyText: this.bodyText,
                userId: this.userId,
                creationDatetime: this.creationDatetime
            })

            try {
                const dbTweet = await tweet.save();
                return resolve(dbTweet);
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    editTweet() {
        return new Promise(async (resolve, reject) => {

            const newTweetData = {};
            if(this.title) {
                newTweetData.title = this.title;
            }
            if(this.bodyText) {
                newTweetData.bodyText = this.bodyText;
            }

            try {
                const oldTweetData = await TweetsSchema.findOneAndUpdate({_id: this.tweetId}, newTweetData);
                return resolve(oldTweetData);
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    deleteTweet() {
        return new Promise(async (resolve, reject) => {
            
            try {
                const tweetData = await TweetsSchema.findOneAndDelete({_id: this.tweetId});
                resolve(tweetData);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    getTweetDatafromTweetId() {
        return new Promise(async (resolve, reject) => {
            try {
                const tweetData = await TweetsSchema.findOne({_id: this.tweetId});
                resolve(tweetData);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    static getTweets(offset) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbTweets = await TweetsSchema.aggregate([
                    // sort, pagination
                    { $sort: {"creationDatetime": -1} },
                    { $facet: {
                        data: [
                            {"$skip": parseInt(offset)}, 
                            {"$limit": constants.TWEETSLIMIT}
                        ]}
                    }
                ])
                
                resolve(dbTweets[0].data);
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    static getMyTweets(offset, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const dbTweets = await TweetsSchema.aggregate([
                    // sort, pagination, check userid
                    {$match: { userId: userId }},
                    { $sort: {"creationDatetime": -1} },
                    { $facet: {
                        data: [
                            {"$skip": parseInt(offset)}, 
                            {"$limit": constants.TWEETSLIMIT}
                        ]}
                    }
                ])
                
                resolve(dbTweets[0].data);
            }
            catch(err) {
                return reject(err);
            }
        })
    }


}

module.exports = Tweets;
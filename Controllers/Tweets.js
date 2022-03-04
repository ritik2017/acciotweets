const express = require('express');
const tweetsRouter = express.Router();

const Tweets = require('../Models/Tweets');

tweetsRouter.post('/create-tweet',async (req, res) => {

    const { title, bodyText } = req.body;
    const { userId } = req.body // req.session.user;

    if(!title || !bodyText) {
        return res.send({
            status: 500,
            message: "Parameters missing"
        })
    }

    if(!userId) {
        return res.send({
            status: 401,
            message: "Invalid UserId"
        })
    }

    if(typeof(title) !== 'string' || typeof(bodyText) !== 'string') {
        return res.send({
            status: 400,
            message: "Title and BodyText should be only text"
        })
    }

    if(title.length > 200 || bodyText > 1000) {
        return res.send({
            status: 401,
            message: "Title and bodytext too long. Allowed chars for title is 200 and bodytext is 1000."
        })
    }

    const creationDatetime = new Date();

    const Tweet = new Tweets({title, bodyText, creationDatetime, userId});

    try {
        const dbTweet = await Tweet.createTweet();

        return res.send({
            status: 200,
            message: "Tweet created Successfully.",
            data: dbTweet
        })
    }
    catch(err) {
        return res.send({
            status: 404,
            message: "Database error",
            error: err
        })
    }
})

tweetsRouter.get('/get-tweets', async (req, res) => {

    const offset = req.query.offset || 0;

    try {
        const dbTweets = await Tweets.getTweets(offset);

        return res.send({
            status: 200,
            message: "Read Successful",
            data: dbTweets
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal error. Please try again",
            error: err
        })
    }
})


tweetsRouter.get('/get-my-tweets', async (req, res) => {

    const offset = req.query.offset || 0;
    const userId = req.session.user.userId;

    try {
        const dbTweets = await Tweets.getTweets(offset, userId);

        return res.send({
            status: 200,
            message: "Read Successful",
            data: dbTweets
        })
    }
    catch(err) {
        return res.send({
            status: 400,
            message: "Internal error. Please try again",
            error: err
        })
    }
})

tweetsRouter.post('/edit-tweet', async (req, res) => {

    const { title, bodyText } = req.body.data;
    const tweetId = req.body;
    const userId = req.session.user.userId;

    if(!title && !bodyText) {
        return res.send({
            status: 400,
            message: "Invalid data",
            error: "Missing title and bodytext"
        })
    }

    if(typeof(title) !== 'string' || typeof(bodyText) !== 'string') {
        return res.send({
            status: 400,
            message: "Title and BodyText should be only text"
        })
    }

    if(title.length > 200 || bodyText > 1000) {
        return res.send({
            status: 401,
            message: "Title and bodytext too long. Allowed chars for title is 200 and bodytext is 1000."
        })
    }

    try {
        // Check whether this tweet actually belongs to the user
        const tweet = new Tweets({title, bodyText, tweetId});
        const tweetData = tweet.getTweetDatafromTweetId();

        if(userId !== tweetData.userId) {
            return res.send({
                status: 400,
                message: "Edit not allowed. Tweet is owned by some other user."
            })
        }

        // Edit the tweet
        // 1. verify the creation datetime
        
        const currentDatetime = Date.now();
        const creationDatetime = new Date(tweetData.creationDatetime);
        const diff = ( currentDatetime - creationDatetime.getTime() ) / ( 1000*60 ); // diff in minutes

        if(diff > 30) {
            return res.send({
                status: 400,
                message: "Edit not allowed after 30 minutes of tweeting"
            }) 
        }

        // 2. Update the tweet in db

        const tweetDb = await tweet.editTweet();

        return res.send({
            status: 200,
            message: "Edit successful",
            data: tweetDb  
        })

    }
    catch(err) {
        return res.send({
            status: 401,
            message: "Internal Error",
            error: err  
        })
    }

})

module.exports = tweetsRouter;
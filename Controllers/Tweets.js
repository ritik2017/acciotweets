const express = require('express');
const tweetsRouter = express.Router();

const Tweets = require('../Models/Tweets');

tweetsRouter.post('/create-tweet',async (req, res) => {

    const { title, bodyText } = req.body;
    const { userId } = req.session.user;

    if(!title || !bodyText) {
        return res.send({
            status: 500,
            message: "Parameters missing"
        })
    }

    if(!userId) {
        return res.send({
            status: 400,
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

module.exports = tweetsRouter;
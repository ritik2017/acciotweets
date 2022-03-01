const TweetsSchema = require('../Schemas/Tweets');

class Tweets {

    title;
    bodyText;
    userId;
    creationDatetime;

    constructor({title, bodyText, userId, creationDatetime}) {
        this.title = title;
        this.bodyText = bodyText;
        this.creationDatetime = creationDatetime;
        this.userId = userId;
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

}

module.exports = Tweets;
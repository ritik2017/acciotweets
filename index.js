// Package imports
const express = require('express');
const session = require('express-session');
const MongoDbSession = require('connect-mongodb-session')(session);

// Files imports
const constants = require('./private_constants');

// Controllers
const AuthRouter = require('./Controllers/Auth');
const TweetsRouter = require('./Controllers/Tweets');
const FollowRouter = require('./Controllers/Follow');

const app = express();

const store = new MongoDbSession({
    uri: constants.MONGOURI,
    collection: 'tb_sessions'
})

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: constants.SESSIONSECRETKEY,
    resave: false,
    saveUninitialized: false,
    store: store
}))

// Controllers
app.use('/auth', AuthRouter);
app.use('/tweets', TweetsRouter);
app.use('/follow', FollowRouter);

app.get('/', (req, res) => {
    res.send({
        status: 200,
        message: "Welcome"
    })
})

module.exports = app;


// JWT - 12 digit 
// cookies, mongodb - 30 Days

// 1st March - 30 March 
// 5th March - 5th April
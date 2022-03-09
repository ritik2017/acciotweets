const validator = require('validator');

function cleanUpAndValidate({name, username, email, phone, password}) {
    return new Promise((resolve, reject) => {
        if(!(name && username && email && password)) {
            return reject('Missing parameters');
        }

        if(!validator.isEmail(email)) {
            return reject('Invalid Email');
        }

        if(validator.isEmail(username)) {
            return reject('Username cannot be an email');
        }

        if(phone && phone.length !== 10) {
            return reject('Invalid Phone number');
        }

        if(username.length < 3) {
            return reject('Username is too short');
        }

        if(username.length > 50) {
            return reject('Username should be at max 50 characters');
        }

        if(password.length < 6) {
            return reject('Password is too short ');
        }

        if(password.length > 200) {
            return reject('Password should be at max 200 characters long');
        }

        if(name.length > 100) {
            return reject('Name should be at max 100 characters long');
        }

        if(!validator.isAlphanumeric(password)) {
            return reject('Password should be alphanumeric');
        }

        resolve();
    })
}

const isAuth = (req, res, next) => {
    if(req.session.isAuth) {
        next()
    }
    else {
        return res.send({
            status: 404,
            message: "Invalid user session. Please log in."
        })
    }
}

module.exports = { cleanUpAndValidate, isAuth };
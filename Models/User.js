const bcrypt = require('bcrypt');

const UserSchema = require('../Schemas/User');

class User {
    
    username;
    email;
    phone;
    name;
    password;

    constructor({username, name, email, password, phone}) {
        this.email = email;
        this.phone = phone;
        this.password = password;
        this.username = username;
        this.name = name;    
    }

    static verifyUsernameAndEmailExists({username, email}) {
        return new Promise(async (resolve, reject) => {

            try {
                const user = await UserSchema.findOne({$or: [{username}, {email}]});

                if(user && user.email === email) {
                    return reject('Email already exists');
                }
    
                if(user && user.username === username) {
                    return reject('Username already taken');
                }
    
                return resolve();
            }
            catch(err) {
                return reject(err);
            }
        })
    }

    static verifyUserIdExists(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const userDb = await UserSchema.findOne({_id: userId});
                resolve(userDb);
            }
            catch(err) {
                reject(err);
            }
        })
    }

    registerUser() {
        return new Promise(async (resolve, reject) => {

            const hashPassword = await bcrypt.hash(this.password, 15);

            const user = new UserSchema({
                username: this.username,
                name: this.name,
                password: hashPassword,
                email: this.email,
                phone: this.phone
            })

            try {
                const dbUser = await user.save();

                return resolve({
                    username: dbUser.username,
                    name: dbUser.name,
                    email: dbUser.email,
                    _id: dbUser._id
                });
            }   
            catch(err) {
                return reject(err);
            }
        })
    }

    // email - ritik@gmail.com
    // username - kumar@gmail.com

    // User1 - ritik@gmail.com, ritik
    // User2 - kumar@gmail.com, kumar

    static loginUser({loginId, password}) {
        return new Promise( async (resolve, reject) => {
            let dbUser = await UserSchema.findOne({$or: [{email: loginId}, {username: loginId}]});
            // Error code below. Refrain from using in prod.
            // if(validator.isEmail(loginId)) {
            //     dbUser = await UserSchema.findOne({email: loginId});
            // }
            // else {
            //     dbUser = await UserSchema.findOne({username: loginId});
            // }

            if(!dbUser) {
                return reject("No user is found");
            }

            const isMatch = await bcrypt.compare(password, dbUser.password);

            if(!isMatch) {
                return reject('Invalid Password');
            }

            resolve({
                username: dbUser.username,
                name: dbUser.name,
                email: dbUser.email,
                _id: dbUser._id
            });
        })
    }
}

module.exports = User;

// Single inheritance 
// P1, P2, C1 - Multilevel inheritance

// static and non-static

// Mongodb.js - findOne, findOneAndUpdate, 
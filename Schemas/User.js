const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    }
})

module.exports = mongoose.model('tb_user', userSchema);

// Size - Very large but with a limit 
// Structure - almost fixed
// Joins - lot of joins - sql is better choice 
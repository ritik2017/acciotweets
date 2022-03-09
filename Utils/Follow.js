const ObjectId = require('mongodb').ObjectId;

function validateMongoDbUserID(userId) {
    if(!userId)
        return false;
    
    if(!ObjectId.isValid(userId))
        return false;

    return true;
} 

module.exports = { validateMongoDbUserID };
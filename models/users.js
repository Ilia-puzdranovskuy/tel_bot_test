const mongoose = require('mongoose');

const  userSchema = new mongoose.Schema({
    userId: {
        type: String
    },
    name: {
        type: String
    },
    tagName:{
        type: String
    },
    email:{
        type: String
    },
    aboutMe:{
        type: String
    },
    photo:{
        type: String
    },
    hobi:{
        type: String
    }
});

const User = mongoose.model('Users', userSchema);

module.exports = User;
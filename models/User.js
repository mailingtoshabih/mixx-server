const mongoose = require('mongoose');



// creating the user schema
const userSchema = mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
            minlength: 3,
            maxlength: 25
        },
        email: {
            type: String,
            require: true,
            minlength: 5,
            maxlength: 25,
            unique: true
        },
        password: {
            type: String,
            require: true,
            minlength: 5
        },
        profilePicture: {
            type: String,
            default: ""
        },
        followers: {
            type: Array,
            default: []
        }, 
        followings: {
            type: Array,
            default: []
        },
        isAdmin: {
            type: Boolean,
            default: false
        },
        description : {
            type : String,
            max : 100,
            default : "dev"
        },
        city : {
            type : String,
            max : 20,
            default : "Earth"
        }
    },
    { timeStamps: true }
);


// creating the model of the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
const mongoose = require('mongoose');



// creating the user schema
const postSchema = mongoose.Schema(
    {
        email: {
            type: String,
            require: true
        },
        username : {
            type : String,
            require : true
        },
        profilePicture : {
            type : String,
            default : ""
        },
        description : {
            type : String,
            max : 500
        },
        image : {
            type : String
        },
        likes : {
            type : Array,
            default : []
        }
    },
    { timeStamps: true }
);

// creating the model of the schema
const Post = mongoose.model('Post', postSchema);


module.exports = Post;
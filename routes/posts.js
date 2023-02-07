const express = require('express');
const router = express.Router();

const Post = require('../models/Post');
const User = require('../models/User');

// ---------------------------------------------------


 

// create a post
router.post('/', async (req, res) => {

    
    try {
        const newpost = new Post(req.body);
        result = await newpost.save();
        res.send(result);
    }
    catch (exc) {
        res.send(exc.message);
    }
});




// update a post
router.put('/:email', async (req, res) => {                                         // use id instead of email in production

    try {
        const post = await Post.findOne({ email: req.params.email });

        if (post.email !== req.body.email) res.send("You can only update your post...");
        else {
            const result = await post.updateOne({ $set: req.body });
            res.send("Post updated...");
        }
    } catch (exc) {
        res.send(exc.message);
    }
})




// delete a post
router.delete('/delete/:id', async (req, res) => {                                         // use id instead of email in production

    try {
        const post = await Post.find({ _id: req.params.id });

        if (post.email !== req.body.email) res.send("You can only delete your post...");
        else{
            const result = await Post.findOneAndDelete({_id : req.params.id});
            res.send("Post deleted...");
        }

    } catch (exc) {
        res.send(exc.message);
    }
})




// like/dislike a post
router.put('/like/:id', async (req, res) => {

    try {
        const post = await Post.findOne({ _id: req.params.id });

        if (post.likes.includes(req.body.email)) {
            await post.updateOne({ $pull: { likes: req.body.email } });
            res.send("AlreadyLiked");

        } else {

            await post.updateOne({ $push: { likes: req.body.email } });
            res.send("Post has been liked...");
        }

    } catch (exc) {
        res.send(exc.message);
    }

})




// get specific persons's post
router.get('/:email', async (req, res) => {

    try {
        const posts = await Post.find({email : req.params.email});
        res.send(posts);

    } catch (exc) {
        res.send(exc.message);
    }
});




// get timeline post
router.get('/', async (req, res) => {

    try {
        const posts = await Post.find();
        res.send(posts);
    } catch (exc) {
        res.send(exc);
    }
});
















module.exports = router;
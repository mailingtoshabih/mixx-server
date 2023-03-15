const User = require('../models/User');

const bcrypt = require('bcrypt');

const express = require('express');
const router = express.Router();
// -------------------------------------------------




// Regitering a user
router.post('/register', async (req, res) => {

    try {
        const salt = await bcrypt.genSalt(10);
        const pass = await bcrypt.hash(req.body.password, salt);          //hashing pass

        const newUser = new User(
            {
                username: req.body.username,
                email: req.body.email,
                password: pass,
                profilePicture : req.body.profilePicture
            }
        );

        await newUser.save();
        res.send('User registered...');
    } catch (exception) {
        res.status(400).send(exception.message);
    }
})


// Login
router.post('/login', async (req, res) => {

    try {
        const user = await User.findOne({ email: req.body.email });

        if (user) {
            const passCorrect = await bcrypt.compare(req.body.password, user.password);
            if (passCorrect) res.send(user);
            else res.status(400).send('Incorrect email or password...');
        }
        else res.status(400).send('Incorrect email or password...');

    } catch (exc) {
        res.status(400).send(exc.message);
    }
});












module.exports = router;
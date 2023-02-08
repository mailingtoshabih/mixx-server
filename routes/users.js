//  users routes
const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/User');





// update a user
router.put('/update/:email', async (req, res) => {

      try {
            if (req.body.email === req.params.email && req.body.isAdmin) {                  // P--change this decision> without logging in user cannot update data

                  if (req.body.password) {
                        const salt = await bcrypt.genSalt(10);
                        const pass = await bcrypt.hash(req.body.password, salt);
                        req.body.password = pass;
                  }

                  const user = await User.findOneAndUpdate({ email: req.body.email }, { $set: req.body });
                  if (user) res.send('Account updated...');

            } else {
                  res.send('You cannot update other accounts...');
            }

      } catch (exc) {
            res.send(exc.message);
      }
})



// delete a user
router.delete('/delete/:email', async (req, res) => {                                      // P--change this decision> without logging in user cannot delete data

      try {
            if (req.body.email === req.params.email && req.body.isAdmin) {                  // P--change this decision> without logging in user cannot update data

                  const result = await User.findOneAndDelete({ email: req.params.email });
                  if (result) res.send('Account deleted successfully...');
                  else res.send('Unable to delete account...');
            } else {
                  res.send('You cannot delete other accounts...');
            }

      } catch (exc) {
            res.send(exc.message);
      }
})



// get a user
router.get("/find/:email", async (req, res) => {

      try {
            const user = await User.find({ email: req.params.email });

            if (user) res.send(user);
            else res.send('User not found...');

      } catch (exc) {
            res.send("Phew! Some error occurred...")
      }
})



// get all users
router.get('/all', async (req, res) => {

      const allUsers = await User.find();
      res.send(allUsers);
})




// follow a user
router.put('/follow/:email', async (req, res) => {

      if (req.body.email === req.params.email) res.send('You cannot follow yourself...');
      else {
            const otherUser = await User.findOne({ email: req.params.email });
            const thisUser = await User.findOne({ email: req.body.email });
            
            if (otherUser && thisUser) {

                  const isFollowing = thisUser.followings.includes(otherUser.email);

                  if (isFollowing) res.send(`You are already following ${otherUser.username}`);
                  else {
                        thisUser.followings.push(otherUser.email);
                        otherUser.followers.push(thisUser.email);

                        const res1 = await thisUser.save();
                        const res2 = await otherUser.save();

                        if (res1 && res2) res.send(`You are following ${otherUser.username}...`);
                        else res.send("Follow unsuccessful...");
                  }
            }
            else {
                  res.send("User is not in the database...");
            }
      }
});



// unfollow a user
router.put('/unfollow/:email', async (req, res) => {

      if (req.body.email === req.params.email) res.send('You can only unfollow others...');
      else {
            const otherUser = await User.findOne({ email: req.params.email });
            const thisUser = await User.findOne({ email: req.body.email });

            if (otherUser && thisUser) {

                  const isFollowing = thisUser.followings.includes(otherUser.email);

                  if (!isFollowing) res.send(`You are not following ${otherUser.username}...`);
                  else {

                        await thisUser.updateOne({ $pull: { followings: req.params.email } });
                        await otherUser.updateOne({ $pull: { followers: req.body.email } });

                        res.send(`You unfollowed ${otherUser.username}...`);
                  }
            }
            else {
                  res.send("User is not in the database...");
            }
      }
});



// get followings
router.get("/followings/:email", async (req, res) => {

      try {
            const user = await User.findOne({ email: req.params.email });

            const followings = await Promise.all(
                  user?.followings?.map((followingsEmail) => {
                        return User.findOne({ email: followingsEmail })
                  })
            )

            let followingList = [];
            
            followings?.map((f) => {
                  const { _id, email, username, profilePicture, followers } = f;
                  followingList.push({_id, email, username, profilePicture, followers });
            })

            res.send(followingList);


      } catch (exc) {
            res.status(500).json(exc);
      }
})




// get my followers data
router.get("/followers/:email", async (req,res) => {
      try{
            const user = await User.findOne({email : req.params.email});
            
            const myFollowers = await Promise.all(
                  user?.followers.map( (followerEmail) => {
                        return User.findOne({email : followerEmail})
                  } )
                  )
            
            res.send(myFollowers) 

      }
      catch(exc){
            res.send(exc.message)
      }
})


// get follow status
router.get("/:otheruser/isfollowing/:thisuser", async (req,res) => {

      try{
            const otheruser = await User.findOne({email : req.params.otheruser});     //finds other user
            const thisuser = await User.findOne({email : req.params.thisuser});     //finds current user
            const status = otheruser?.followings?.includes(thisuser?.email);
            status && res.send(status)
      }catch(exc){
            res.send("Some error occurred...")
      }
})




module.exports = router;
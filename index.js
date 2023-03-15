const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3001;

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
// ---------------------------------------------------------------------------------------


dotenv.config();


mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to DB...'))
    .catch((err) => console.error(err.message));




// middlewares
app.use(cors());
app.use(express.json());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));





app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);



app.get("/", (req, res) => {
    res.send("Kindly visit https://bliss.onrender.com");
})


app.listen(port, () => {
    console.log(`Server at port ${port}...`);
})
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const app = express();
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const port = process.env.PORT || 3001;

const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
// ---------------------------------------------------------------------------------------




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



// -----------------------------------------------read multer docs
app.use("/images", express.static(path.join(__dirname, "public/images")));

const storage = multer.diskStorage({

    destination : (req,file,cb) => {
        cb(null, "public/images")
    },      
    filename : (req,file,cb) => {
        cb(null, file.originalname)
    },
})

const upload = multer({storage : storage});
app.post("/api/upload", upload.single("file"),async (req, res) => {
    try {
        return res.status(200).json("File uploaded successfully...")
    } catch (exc) {
        console.log(exc.message);
    }
})
// ----------------------------------------------



app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.get("/", (req,res) => {
    res.send("MIXSERVER");
})




app.listen(port, () => {
    console.log(`Server at port ${port}...`);
})
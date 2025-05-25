require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");


const GoogleInfo = require("./models/googleInfo.js");
const googleInfoRoutes = require("./routes/googleInfo.js");

const app = express();

app.use(express.json());
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public', 'homePage.html'));
});


app.use(googleInfoRoutes);


mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log("Connected to MonogoDb Database")
        app.listen(process.env.PORT, () => {
            console.log(`Server is live at port ${process.env.PORT}`);
        })

    }).catch((error) => {
        console.log("Database connection error ", error);
    });
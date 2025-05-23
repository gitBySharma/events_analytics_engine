require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");


const app = express();

app.use(express.json());
app.use(cors());


app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './public', 'index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`Server is live at port ${process.env.PORT}`);
});
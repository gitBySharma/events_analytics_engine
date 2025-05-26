require("dotenv").config();

const jwt = require("jsonwebtoken");
const User = require("../models/googleInfo.js");


exports.googleIDAuthentication = async (req, res, next) => {
    try {
        //get the token, either from header or query param for first successfull login
        const token = req.header("Authorization") ? req.header("Authorization") : req.query.token;
        if (!token) {
            return res.status(400).json({ message: "Access denied. No token provided" });
        }

        //verify the user
        let decodedUser;
        try {
            decodedUser = jwt.verify(token, process.env.JWT_SECRET);

        } catch (error) {
            console.log("Token verification error");
            if (error.name === "TokenExpiredError") {
                return res.status(401).json({ message: "Token has expired, please login again" });

            }
            return res.status(401).json({ message: "Invalid Token" });

        }

        const user = await User.findOne({ id: decodedUser._id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });

        }

        req.user = user;
        next();

    } catch (error) {
        console.log("Google ID Authentication error - ", error);
        res.status(500).json({ message: "Internal server error" });

    }
}
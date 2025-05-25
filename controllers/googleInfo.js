require('dotenv').config();

const path = require("path");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const GoogleInfo = require("../models/googleInfo.js");


const client = new OAuth2Client({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_REDIRECT_URL,
});


exports.googleAuth = async (req, res) => {
    try {
        //generate google Oauth url
        const url = client.generateAuthUrl({
            access_type: "offline",
            scope: ["profile", "email"],
            prompt: "consent",
        });

        res.status(200).json({ url: url });

    } catch (error) {
        console.log("Error getting OAuth URL  ", error);
        res.status(500).json({ message: "Authentication failed" });

    }
};


exports.googleCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code) {
            return res.status(400).json({ message: "Invalid request. Authorization code required" });
        }

        //exchange code for tokens
        const { tokens } = await client.getToken(code);

        // Get user info using Google's people API
        const ticket = await client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        // Simplified user lookup/creation
        let user = await GoogleInfo.findOneAndUpdate(
            { googleId: payload.sub },
            {
                email: payload.email,
                name: payload.name,
            },
            { upsert: true, new: true } // Creates if doesn't exist, returns updated doc
        );

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        //json response for backend only api
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        });

        // //redirected response for frontend simulation
        // res.redirect(`/dashboard?token=${token}`);

    } catch (error) {
        console.log("Error during callback", error);
        res.status(500).json({ message: "Authentication failed" });

    }
};
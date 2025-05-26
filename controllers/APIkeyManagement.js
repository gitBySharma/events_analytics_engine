require("dotenv").config();

const bcrypt = require("bcrypt");
const crypto = require("crypto");

const APIKeys = require("../models/APIKeys.js");


//function to generate api key using crypto's randombytes
function generate_API_key() {
    return crypto.randomBytes(32).toString("base64url");
}


//function to register an app and generate API key for them
exports.register_and_generateAPIKey = async (req, res, next) => {
    try {
        const appName = req.body.name;
        if (!appName) {
            return res.status(400).json({ message: "App name is required" });
        }

        const api_key = generate_API_key();  //generates api key

        const encrypted_api_key = await bcrypt.hash(api_key, 10);  //encrypting the api key to store in database

        const app_data = await APIKeys.create({
            APIid: req.user.id,
            APIKey: encrypted_api_key,
            name: appName
        });

        res.status(200).json({ message: "API Key created successfully", api_key: api_key, success: true });

    } catch (error) {
        console.log("API Key creation error - ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
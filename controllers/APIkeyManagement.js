require("dotenv").config();

const crypto = require("crypto");

const APIKeys = require("../models/APIKeys.js");
const services = require("../util/services.js");



//function to register an app and generate API key for them
exports.register_and_generateAPIKey = async (req, res) => {
    try {
        const appName = req.body.name;
        if (!appName) {
            return res.status(400).json({ message: "App name is required" });
        }

        //check if an API key already exists for that user
        const is_existing = await APIKeys.findOne({ createdBy: req.user.id });
        if (is_existing && !is_existing.revoked) {
            return res.status(401).json({ message: "Maximum one API key is allowed per user" });
        }

        const api_key = services.generate_API_key();  //generates api key

        const encrypted_api_key = services.encrypt(api_key);  //encrypting the api key to store in database

        const app_data = await APIKeys.create({
            createdBy: req.user.id,
            APIKey: encrypted_api_key,
            name: appName
        });

        res.status(200).json({ message: "API Key created successfully", api_key: api_key, name: app_data.name, success: true });

    } catch (error) {
        console.log("API Key creation error - ", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//function to retrieve an API key
exports.getAPIkey = async (req, res) => {
    try {
        const api_key = await APIKeys.findOne({ createdBy: req.user.id });
        if (!api_key) {
            return res.status(401).json({ message: "No API key found" });
        }

        //check if the api_key is active or not
        if (api_key.revoked) {
            return res.status(400).json({ message: "API key no longer active" });
        }

        const decrypted_api_key = services.decrypt(api_key.APIKey);  //decrypt the api key to send to client

        res.status(200).json({ message: "API key retrieved successfully", api_key: decrypted_api_key, name: api_key.name, success: true });

    } catch (error) {
        console.log("API key retrieval error - ", error);
        res.status(500).json({ message: "Internal server error" });

    }
}
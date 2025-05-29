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
        const is_existing = await APIKeys.findOne({ createdBy: req.user.id, revoked: false });
        if (is_existing) {
            return res.status(401).json({ message: "Maximum one API key is allowed per user" });
        }

        const api_key = services.generate_API_key();  //generates api key
        const api_key_hash = services.hash(api_key);  //generate a hash for future lookup in database

        const encrypted_api_key = services.encrypt(api_key);  //encrypting the api key to store in database

        const app_data = await APIKeys.create({
            createdBy: req.user.id,
            APIKey: encrypted_api_key,
            APIKeyHash: api_key_hash,
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
        const api_key = await APIKeys.findOne({ createdBy: req.user.id, revoked: false });
        if (!api_key) {
            return res.status(401).json({ message: "No API key found" });
        }

        const decrypted_api_key = services.decrypt(api_key.APIKey);  //decrypt the api key to send to client

        res.status(200).json({ message: "API key retrieved successfully", api_key: decrypted_api_key, name: api_key.name, success: true });

    } catch (error) {
        console.log("API key retrieval error - ", error);
        res.status(500).json({ message: "Internal server error" });

    }
}



//function to revoke an api key
exports.revokeAPIkey = async (req, res) => {
    try {
        const api_key = req.body.api_key;
        if (!api_key) {
            return res.status(401).json({ message: "API Key is required" });
        }

        const api_key_hash = services.hash(api_key);  //hashing the key to search in the database

        //search for the api key
        const api_key_record = await APIKeys.findOne({
            APIKeyHash: api_key_hash,
            createdBy: req.user.id
        });

        //if no api key found or the user is not the creator
        if (!api_key_record) {
            return res.status(404).json({ message: "API key not found" });
        }

        //if the api key is already revoked
        if (api_key_record.revoked) {
            return res.status(400).json({ message: "Invalid request. API key is already revoked" });
        }

        //revoke the api key
        api_key_record.revoked = true;

        //save the changes
        await api_key_record.save();

        res.status(200).json({
            message: "API key revoked successfully",
            success: true
        });


    } catch (error) {
        console.log("API key revocation error - ", error);
        res.status(500).json({ message: 'Internal server error' });

    }
}
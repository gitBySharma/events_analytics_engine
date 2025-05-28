const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const APIKeysSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    APIKey: {
        type: String,
        Unique: true,
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoogleInfo",
        required: true
    },
    usageCount: {
        type: Number
    },
    revoked: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


module.exports = mongoose.model("APIKeys", APIKeysSchema);
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const EventSchema = new Schema({
    event: {
        type: String,
        required: true
    },
    url: String,
    referrer: String,
    device: String,
    ipAddress: String,
    timeStamp: {
        type: Date,
        default: Date.now
    },
    metaData: {
        browser: String,
        os: String,
        screenSize: String,
        userAgent: String,
    },
    appId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "APIKeys",
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GoogleInfo",
        required: true
    }
}, { timestamps: true }, { strict: false });



module.exports = mongoose.model("EventData", EventSchema);
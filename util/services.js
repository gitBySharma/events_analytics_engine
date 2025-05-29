require("dotenv").config();

const crypto = require("crypto");

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;


//function to generate api key using crypto's randombytes
exports.generate_API_key = function () {
    return crypto.randomBytes(32).toString("base64url");
}


//function to generate a hash of the api key for future lookup in database
exports.hash = function (text) {
    return crypto.createHash('sha256').update(text).digest('hex');
}


//function to encrypt a string
exports.encrypt = function (text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
}


//function to decrypt
exports.decrypt = function (encryptedText) {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedTextBuffer = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedTextBuffer);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}
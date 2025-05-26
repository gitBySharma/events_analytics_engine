const express = require("express");

const router = express.Router();

const APIkeyManagementController = require("../controllers/APIkeyManagement.js");
const authentication = require("../middleware/authentication.js");


//route to register and generate API key
router.post("/api/auth/register", authentication.googleIDAuthentication, APIkeyManagementController.register_and_generateAPIKey);



module.exports = router;
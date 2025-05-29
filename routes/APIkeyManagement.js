const express = require("express");

const router = express.Router();

const APIkeyManagementController = require("../controllers/APIkeyManagement.js");
const authentication = require("../middleware/authentication.js");


//route to register and generate API key
router.post("/api/auth/register", authentication.googleIDAuthentication, APIkeyManagementController.register_and_generateAPIKey);

//route to retrieve a api key
router.get("/api/auth/api-key", authentication.googleIDAuthentication, APIkeyManagementController.getAPIkey);

//route to revoke an api key
router.post("/api/auth/revoke", authentication.googleIDAuthentication, APIkeyManagementController.revokeAPIkey);


module.exports = router;
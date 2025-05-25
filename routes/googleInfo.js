const express = require("express");

const googleInfoController = require("../controllers/googleInfo.js");

const router = express.Router();


//Google authentication routes
router.get("/auth/google/url", googleInfoController.googleAuth);
router.get("/auth/google/callback", googleInfoController.googleCallback);



module.exports = router;
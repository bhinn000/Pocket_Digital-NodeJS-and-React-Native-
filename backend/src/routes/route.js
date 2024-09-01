const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/accountUpdate");
const { uploadMainBankID } =require("../controllers/mainID");
const { preSettingGET , preSettingPOST} =require("../controllers/fieldRate");

router.post("/register", register);
router.post("/login", login);
router.post('/uploadMainBankID',uploadMainBankID)
router.post('/preSettingPOST',preSettingPOST)
router.get('/preSettingGET',preSettingGET)

module.exports = router;

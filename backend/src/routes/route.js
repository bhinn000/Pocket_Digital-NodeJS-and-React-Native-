const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/accountUpdate");
const { uploadMainBankID } =require("../controllers/mainID");
const { preSettingGET , preSettingPOST} =require("../controllers/fieldRate");
const { userData , deleteAccount}= require("../controllers/dashboard");

router.post("/register", register);
router.post("/login", login);
router.post('/uploadMainBankID',uploadMainBankID)
router.post('/preSettingPOST',preSettingPOST)
router.get('/preSettingGET',preSettingGET)
router.post('/userData', userData)
router.post('/deleteAccount', deleteAccount)

module.exports = router;

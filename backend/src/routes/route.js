const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/accountUpdate");
const { uploadMainBankID } =require("../controllers/mainID");
const { preSettingGET , preSettingPOST} =require("../controllers/fieldRate");
const { userData , deleteAccount , feedback, fieldDetails , payOkay , uploadReceiverData , bankBalance , showMoneyToPocket}= require("../controllers/dashboard");

router.post("/register", register);
router.post("/login", login);
router.post('/uploadMainBankID',uploadMainBankID)
router.post('/preSettingPOST',preSettingPOST)
router.get('/preSettingGET',preSettingGET)
router.post('/userData', userData)
router.post('/deleteAccount', deleteAccount)
router.post('/feedback', feedback)
router.post('/fieldDetails' , fieldDetails)
router.post('/payOkay' , payOkay)
router.post('/uploadReceiverData' , uploadReceiverData)
router.post('/bankBalance' , bankBalance)
router.get('/loadMoneyToPocket' , showMoneyToPocket)


module.exports = router;

const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/accountUpdate");
const { uploadMainBankID } =require("../controllers/mainID");

router.post("/register", register);
router.post("/login", login);
router.post('/uploadMainBankID',uploadMainBankID)

module.exports = router;

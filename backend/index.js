
const express=require("express")
const app=express()
const mongoose=require("mongoose")
const QRCode=require("qrcode")
require("./controllers/accountHolder")
const accountHolderDetails=require("./controllers/accountHolder") // this has confusion//userSchema
const accountActivityDetails=require("./controllers/accountActivity")//accountDetails ***
const trashAccountDetails=require("./controllers/trashUser")
const adminDetails=require("./controllers/admin")
const feedbackDetails=require("./controllers/feedback")
const receiverSchema=require("./controllers/receiverSchema")
const mainBankIDdetails=require("./controllers/mainBankID")
// const preSetting_model=require("./controllers/preSettings")
app.use(express.json())
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const util = require('util');
const fs = require('fs');
const path = require('path'); 
const accountHolder = require("./controllers/accountHolder")
// const axios=require("axios") 

const mongoUrl=
process.env.mongoUrl

const JWT_SECRET=process.env.JWT_SECRET

//port number
app.listen(5001,()=>{
    console.log("NodeJS is running")
})

//routes and response
// to the root URL path
app.get('/',(req,res)=>{
    res.send({status:"Started"})
})
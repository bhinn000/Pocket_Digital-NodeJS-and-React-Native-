require('dotenv').config()
const express=require("express")
const app=express()
const mongoose=require("mongoose") 

// Global Middleware
app.use(express.json()) 

const routes=require("./src/routes/route")
// const accountHolderDetails=require("./controllers/accountHolder") // this has confusion//userSchema
// const accountActivityDetails=require("./controllers/accountActivity")//accountDetails ***
// const trashAccountDetails=require("./controllers/trashUser")
// const adminDetails=require("./controllers/admin")  
// const feedbackDetails=require("./controllers/feedback")
// const receiverSchema=require("./controllers/receiverSchema")
// const mainBankIDdetails=require("./controllers/mainBankID")
// const preSetting_model=require("./controllers/preSettings")

// const bcrypt=require("bcrypt")
// const jwt=require("jsonwebtoken") 
// const util = require('util');
// const fs = require('fs');
// const path = require('path'); 
// const accountHolder = require("./controllers/accountHolder")
// const axios=require("axios") 

const mongoUrl=
process.env.mongoUrl

//port number
app.listen(8086,()=>{
    console.log("NodeJS is running")
})

//routes and response
// to the root URL path
app.get('/',(req,res)=>{
    res.send({status:"Started"})
})

app.use('/api', routes);

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database has been connected");
}).catch((err) => {
    console.error("Database connection error:", err);
});


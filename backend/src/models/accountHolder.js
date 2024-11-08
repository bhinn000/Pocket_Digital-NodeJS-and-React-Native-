//the database of all the accounts exist

// account holder database
const mongoose=require("mongoose")
const accountHolderSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true,
        unique: true
        
    },
    // userId: {
    //     type: String,
    //     default: function() {
    //         // Calculate the userId based on the mainID
    //         return this.mainID.replace('MBI', 'UID');
    //     }
    // },
    userId: {
        type: String,
        unique:true
    },
    email: {
        type: String,
        unique: true,
    },
    phoneNumber: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },
    mainID:{
        type: String,
        required:true
    },
    rating:{
        type:Number, 
    }
});
    

const accountHolder=mongoose.model ("accountHolderSchema",accountHolderSchema)
module.exports= accountHolder 
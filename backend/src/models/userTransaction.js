const mongoose=require("mongoose")
const transactionSchema=new mongoose.Schema({
    name:{
        type:String,
        
    },
    bankBalance:{
        type:Number
    },
    transactionHistory:[
        {
            latestBalance: {
                type:Number,
                // required:true
            },
            // date:{
            //     type:Date,
            //     required:true,
            //     default:date.now 
            // },
            type:{
                type:String,
                enum:['credit' , 'debit'],
                required:true
            },
           amount:{
                type:Number,
                required:true
            }
        }
    ]
}) 

const accountDetails=mongoose.model("transactionDetail" , transactionSchema)
module.exports=accountDetails
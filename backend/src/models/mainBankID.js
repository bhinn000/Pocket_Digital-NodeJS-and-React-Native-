//done through postman
//database of the account holder of the bank (Not bank App)
const mongoose=require('mongoose')

const mainBankIDSchema=new mongoose.Schema({
    mainBankId:{
        type:String,
        required:true,
    },
    paisa:{
        type:Number,
        required:true,
    }
  
})

const mainBankID=mongoose.model('mainBankIDSchema',mainBankIDSchema)
module.exports=mainBankID
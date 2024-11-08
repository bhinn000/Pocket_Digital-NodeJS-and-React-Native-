const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken") 
const JWT_SECRET=process.env.JWT_SECRET
// const transactionDetail=require("./controllers/userTransaction")

const transactionDetail=require("../models/theirAccountActivities")
const mainBankDetail=require("../models/mainBankID")
const accountHolder = require("../models/accountHolder")

const userData= async(req,res)=>{
    console.log("Hellos")
    //JSON Web Token is an open standard for securely transferring data within parties using a JSON object
    const token = req.headers['authorization']?.split(' ')[1]; //token from authorisation header instead
    if (!token) {
        return res.status(400).json({ status: "error", error: "Token is missing" });
    }
    console.log(token);
    try{ 
        const user=jwt.verify(token,JWT_SECRET)
        console.log("Test " , user);

        const userId=user.userId;
        const mainBankId=userId.replace('UID', 'MBI');

        const data= await transactionDetail.findOne({id:userId})
        if(data){
            return res.send({status:"ok" , data:data}) 
        }
        else{
            const mainBankData=await mainBankDetail.findOne({mainBankId:mainBankId})
            if (mainBankData) {
                return res.send({ status: "ok", data: mainBankData });
            } else {
                // If no data found in both transactionDetail and mainBankID
                return res.status(404).json({ status: "error", error: "User data not found in main bank" });
            }
        }
    }
    catch(error){
        return res.send({ status: "error", error: "Invalid token" });
    }
}

//for payment function in backend
const pay= async(req,res)=>{
    //check also if it is logged in or not
    const {name, amount}=req.body //frontend bata k pathayeko tyo chai rakhne ho

    const user=await transactionDetail.findOne({name:name})
    if(!user){
        return res.send({ status:"not ok" , error: "User not found" });
    }


    if(user.bankBalance < amount){
        return res.send({status:"not ok" , message:"You dont have that much balance"})
    }
    else if(user.bankBalance - amount < 500){
        return res.send({status:"not ok" , message:"Minimum balance to maintain is Rs. 500"})
    }
 
    user.bankBalance-=amount
    
    user.transactionHistory.push({
            latestBalance:user.bankBalance,
            type:'debit',
            amount:amount,
            
    })
     
    await user.save()
    return res.status(200).json({status:"ok",newBalance:user.bankBalance})

}

//for view transactions history
const viewTransactions= async(req,res)=>{
    const {name}=req.body
    const user=await transactionDetail.findOne({name:name})
    console.log(user)
    return res.send({status:"here it is" , data:user.transactionHistory})
}

// //upload bankBalance of all bank account holders' whose may or maynot have our digital wallet
// // to insert the bank balance of all database
// const bankBalance= async(req,res)=>{
    
//     const {name,bankBalance}=req.body
//     console.log(req.body.bankBalance)
//     if (!name || !bankBalance) {
//         return res.status(400).json({ error: "Name and bank balance are required." });
//     }

//     try {
//         await transactionDetail.create({...req.body});
//         return res.status(201).json({ message: "Data inserted successfully" });  
//     } catch (error) {
//         console.error("Error inserting data:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// }

//to delete all bank Balance of all users
const deleteAll = async(req,res)=>{
      await transactionDetail.deleteMany({}) //to delete all 
      res.status(200).send("All data of this collection has been deleted successfully")
    
  }

//delete my account

const deleteAccount = async (req, res) => {
    const {token}=req.body
    try{

        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
        const user = await transactionDetail.findOne({ name: userName });
        if(!user){
            return res.status(404).json({ error: "User not found" });
        }

       
        await transactionDetail.deleteOne({ name: userName });
        await accountHolder.deleteOne({ name: userName });

        res.send({ status: 'ok', message: 'Account deleted and moved to trash' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 'error', message: err.message }); 
    }
}; 
module.exports={deleteAll ,deleteAccount, userData , pay , viewTransactions}



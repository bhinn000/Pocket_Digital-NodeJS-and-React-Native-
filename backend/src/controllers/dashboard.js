const bcrypt=require("bcrypt")
const util = require('util');
const jwt=require("jsonwebtoken") 
const JWT_SECRET=process.env.JWT_SECRET
// const transactionDetail=require("./controllers/userTransaction")

const transactionDetail=require("../models/theirAccountActivities")
const mainBankDetail=require("../models/mainBankID")
const accountHolder = require("../models/accountHolder")
const receiverSchema=require("../models/receiver")

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




//for view transactions history
const viewTransactions = async(req,res)=>{
    const {token}=req.body
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userId = decodedToken.userId;
        const user = await transactionDetail.findOne({userId:userId });
        if (!user) {
            return res.status(404).send({ status: "error", error: "User not found" });
        }

        //  // Sort transactions in descending order by date (assuming `payDate` is a Date object)
        //  const sortedTransactions = user.transactionHistory.sort((a, b) => new Date(b.payDate) - new Date(a.payDate));
        
        //  return res.send({ status: "success", data: sortedTransactions });

        return res.send({ status: "success", data: user.transactionHistory });

    } catch (error) {
        return res.status(500).send({ status: "error", error: error.message });
    }
}

const showMoneyToPocket = async (req, res) => {

    const token = req.headers['authorization']?.split(' ')[1]; 
    if (!token) {
        return res.status(400).json({ status: "error", error: "Token is missing" });
    }
    console.log("Saiyaan")
    try {
        const user=jwt.verify(token,JWT_SECRET)
        console.log("Test hello" , user);
        const userId=user.userId
        const accountActivity = await transactionDetail.findOne({ userId });

        if (!accountActivity) {
            return res.status(500).json({ message: "Account activity not found for this user." });
        }

        // Fetch the last entry from bankBalance to get the most recent currentBalance
        const lastBankBalance = accountActivity.bankBalance[accountActivity.bankBalance.length - 1];

        // If no bank balance entry exists, start with 0
        const currentBalance = lastBankBalance ? lastBankBalance.currentBalance : 0;

        return res.status(200).json({
            message: "Current balance fetched successfully",
            currentBalance: currentBalance
        });

    } catch (error) {
        console.error("Error fetching balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



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

//get userRating
const userRating= async (req, res) => {
    const { token } = req.body;

    try {
        // Decode the token to get the user's information
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
      
        // Find the account holder document by name
        const user = await accountHolder.findOne({ name: userName });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Retrieve the rating from the user document
        const rating = user.rating || 0; // If rating field is not present, default to 0

        return res.status(200).json({ status: 'ok', rating });
    } catch (err) {
        console.error('Error retrieving rating:', err);
        return res.status(500).json({ status: 'error', error: err.message });
    }
};

//give feedback or to give stars
const feedback= async (req, res) => {
    const { token, rating } = req.body;
    console.log(token)

    if (!rating) {
        return res.status(400).json({ error: 'Rating is required' });
    }

    try {
        // Decode the token to get the user's information
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
      
        // Update the account holder document with the provided rating
        await accountHolder.findOneAndUpdate(
            { name: userName }, // Find the account holder by name
            { $set: { rating: rating } }, // Update the rating field
            { new: true } // Return the updated document
        );

        return res.status(200).json({ status: 'ok', message: 'Rating submitted successfully' });
    } catch (err) {
        console.error('Error submitting rating:', err);
        return res.status(500).json({ status: 'error', error: err.message });
    }
};

const fieldDetails = async (req, res) => {
    const { token, selectedField } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
        const user = await transactionDetail.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userId = decodedToken.userId;
        const mainBankId = userId.replace('UID', 'MBI');
        const mainBankData = await mainBankDetail.findOne({ mainBankId });
        console.log(util.inspect(user, { depth: null, colors: true }));

         const latestBankBalance = user.bankBalance.sort((a, b) => new Date(b.loadedDate) - new Date(a.loadedDate))[0];
         let wholeBudget = latestBankBalance.currentBalance; 
        if (user.transactionHistory.length > 0) {
            if (user.transactionHistory[0].payMonth == user.bankBalance[0].loadedMonth) {
                console.log("In this month, the first payment has already been done after money loaded for this month");

                const fieldDefined = user.bankBalance[0].fieldLimit.some(field => field.selectedField === selectedField);

                if (fieldDefined) {
                    const selectedFieldLimit = user.bankBalance[0].fieldLimit.find(fl => fl.selectedField === selectedField);
                    console.log("Test", selectedFieldLimit);
                    return res.send({ status: "ok", message: [selectedFieldLimit] });

                } else {
                    user.preSettings.forEach(preSetting => {
                        if (selectedField === preSetting.title) {
                            user.bankBalance[0].fieldLimit = user.bankBalance[0].fieldLimit.filter(fl => fl.selectedField !== selectedField);
                            fieldLimit = preSetting.budget / 100 * wholeBudget;
                            user.bankBalance[0].fieldLimit.push({
                                selectedField,
                                amount: fieldLimit
                            });

                            console.log("FieldLimit first=>", user.bankBalance[0].fieldLimit);
                            return res.send({ status: "ok", message: user.bankBalance[0].fieldLimit.filter(fl => fl.selectedField === selectedField) });
                        }
                    });
                }
            } else if (user.transactionHistory[0].payMonth > user.bankBalance[0].loadedMonth) {
                console.log("You need to load at first to pay for that month because payMonth is greater than loaded Month");
                return res.send({ status: "not ok", message: "Not possible" });
            } else {
                user.preSettings.forEach(preSetting => {
                    if (selectedField === preSetting.title) {
                        fieldLimit = preSetting.budget / 100 * wholeBudget;
                        user.bankBalance[0].fieldLimit.push({
                            selectedField,
                            amount: fieldLimit
                        });
                        console.log("FieldLimit first=>", user.bankBalance[0].fieldLimit);
                        return res.send({ status: "ok", message: user.bankBalance[0].fieldLimit.filter(fl => fl.selectedField === selectedField) });
                    }
                });
            }
        } else {
            user.preSettings.forEach(preSetting => {
                if (selectedField === preSetting.title) {
                    fieldLimit = preSetting.budget / 100 * wholeBudget;
                    user.bankBalance[0].fieldLimit.push({
                        selectedField,
                        amount: fieldLimit
                    });
                    console.log("FieldLimit first=>", user.bankBalance[0].fieldLimit);
                    return res.send({ status: "ok", message: user.bankBalance[0].fieldLimit.filter(fl => fl.selectedField === selectedField) });
                }
            });
        }
        await user.save();
    } catch (err) {
        console.log(err);
    }
};

const payOkay = async (req, res) => {
    const { token, amount, selectedField, receiverID } = req.body;
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
        const userId = decodedToken.userId;
        const user = await transactionDetail.findOne({ userId:userId});
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        console.log("selectedField", selectedField);

        const selectedFieldData = user.bankBalance[0].fieldLimit.find(item => item.selectedField === selectedField);
        console.log(user.bankBalance[0].fieldLimit )
        console.log(amount)
        if (selectedFieldData.amount < amount) {
            return res.send({ status: "not ok", message: "You don't have that much balance for this field" });
        } else if (user.bankBalance[0].fieldLimit - amount < 10) {
            return res.send({ status: "not ok", message: "Minimum balance to maintain is Rs. 10" });
        } else {
            selectedFieldData.amount -= amount;
            user.bankBalance[0].currentBalance -= amount;

            const newTransaction = {
                currentBalance: user.bankBalance[0].currentBalance,
                payDate: new Date(Date.now() + (5.75 * 60 * 60 * 1000)),
                type: 'debit',
                amount: amount,
                field: selectedField
            };
            user.transactionHistory.push(newTransaction);

            user.transactionHistory.sort((a, b) => {
                const dateA = new Date(a.payDate);
                const dateB = new Date(b.payDate);
                return dateB - dateA;
            });

            await user.save();
            const receiver = await receiverSchema.findOne({ receiverID: receiverID });
            if (!receiver) {
                return res.status(404).json({ status: "not ok", message: "Receiver not found" });
            }
            await receiver.save();

            return res.send({
                status: "ok",
                message: "Payment Successful",
                currentBalance: user.bankBalance[0].currentBalance,
                fieldLimit: selectedFieldData.amount
            });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


const deleteReceiverData = async (req, res) => {
    try {
        const { receiverID } = req.body;

        // Validation to ensure receiverID is present
        if (!receiverID) {
            return res.status(400).json({ message: 'Receiver ID is required' });
        }

        // Delete the receiver from the database
        const deletedReceiver = await receiverSchema.findOneAndDelete({ receiverID });
        console.log(deletedReceiver)
        // If receiver not found
        if (!deletedReceiver) {
            return res.status(404).json({ message: 'Receiver not found' });
        }

        // Respond with the deleted receiver
        res.status(200).json({ message: 'Receiver deleted successfully', deletedReceiver });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}; 

const deleteAllReceiverData = async (req, res) => {
    try {
        // Delete all receivers from the database
        const result = await receiverSchema.deleteMany({});
        console.log(result);

        // Respond with the result of the deletion
        res.status(200).json({ message: 'All receivers deleted successfully', result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const uploadReceiverData = async (req, res) => {
    try {
        const receivers = req.body;

        // Check if the request body is an array
        if (!Array.isArray(receivers)) {
            return res.status(400).json({ message: 'Data should be an array of receiver objects' });
        }

        const results = [];

        for (const receiverData of receivers) {
            const { name, receiverID, phoneNumber, balance, organisation} = receiverData;

            // Validation to ensure all fields are present
            if (!name || !receiverID || !phoneNumber || !balance || !organisation) {
                return res.status(400).json({ message: 'All fields are required for each receiver' });
            }

            // Ensure name contains both first and last name
            const nameParts = name.trim().split(' ');
            if (nameParts.length < 2) {
                return res.status(400).json({ message: 'Name must contain both first and last name' });
            }

            // Ensure phone number is a 10-digit number starting with 97 or 98
            const phonePattern = /^(98|97)\d{8}$/;
            if (!phonePattern.test(phoneNumber.toString())) {
                return res.status(400).json({ message: 'Phone number must be a 10-digit number starting with 97 or 98' });
            }

            // Check if receiverID already exists
            const existingReceiver = await receiverSchema.findOne({ receiverID });
            if (existingReceiver) {
                return res.status(400).json({ message: `Receiver ID ${receiverID} already exists` });
            }

            // Create a new receiver
            const newReceiver = new receiverSchema({
                name,
                receiverID, 
                phoneNumber,
                balance, 
                organisation
            });

            // Generate QR code for receiver data
            //Incomplete for QR code concept
            // const receiverDataString = JSON.stringify({receiverID, phoneNumber});
            // const qrCodeFilePath = path.join(__dirname, `qr_codes/${receiverID}.png`);
            // await QRCode.toFile(qrCodeFilePath, receiverDataString); // Generate and save QR code image
            // newReceiver.qrCode = qrCodeFilePath; // Save the path to the QR code image in the database

            // Save the receiver to the database
            const savedReceiver = await newReceiver.save();
            results.push(savedReceiver);
        }

        // Respond with the saved receivers
        res.status(201).json(results);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error',  error: error.message  });
    }
};


const bankBalance = async (req, res) => {
    const { userId, theMoneyIwanttoload } = req.body;
    const mainBankId=userId.replace('UID', 'MBI');
    console.log("Test")
    if (!userId || !theMoneyIwanttoload) {
        return res.status(400).json({ message: "UserID and amount to load are required." });
    }

    try {
        // Fetch the main bank details for the user based on their userId
        const mainBank = await mainBankDetail.findOne({ mainBankId: mainBankId });  // Adjusted to search by userId
        
        if (!mainBank) {
            return res.status(500).json({ message: "Main bank account not found for this user." });
        }

        // Check if theMoneyIwanttoload is within the available paisa
        if (theMoneyIwanttoload > mainBank.paisa) {
            return res.status(400).json({ message: "Insufficient funds in the main bank." });
        }

        // Update the main bank's paisa balance
        mainBank.paisa -= theMoneyIwanttoload;
        await mainBank.save();

        // Now proceed to update the user's bank balance (as per your schema)
        const user = await transactionDetail.findOne({ userId });

        if (!user) {
            return res.status(500).json({ message: "Your pocket digital account not found." });
        }

        // Calculate the new current balance
        const totalCurrentBalance = user.bankBalance.reduce((total, entry) => total + entry.currentBalance, 0) + theMoneyIwanttoload;
        console.log("Test " , user.bankBalance)

        // Create a new bank balance entry
        user.bankBalance.push({
            loadedAmount: theMoneyIwanttoload,         // Amount to be loaded
            currentBalance: totalCurrentBalance,      // Updated total balance
            // loadedDate: new Date(),                   // Set the current date
            // loadedMonth: new Date().getMonth() + 1,   // Set the current month
            fieldLimit: []                            // Assuming no specific field limit, adjust if needed
        });

        // Save the updated user account details
        await user.save();

        return res.status(200).json({ message: "Bank balance updated successfully", user , totalCurrentBalance });

    } catch (error) {
        console.error("Error updating balance:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};



const viewSummary= async (req, res) => {
    const { token } = req.body;
    
    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
        const user = await accountActivityDetails.findOne({ name: userName });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Initialize an object to store the total expenses for each heading
        const totalExpenses = {};
        
        // Iterate through the user's transaction history
        user.transactionHistory.forEach(transaction => {
            // Check if the transaction field exists in the totalExpenses object
            if (!totalExpenses[transaction.field]) {
                // If not, initialize it to the transaction amount
                totalExpenses[transaction.field] = transaction.amount;
            } else {
                // If it exists, add the transaction amount to the existing total
                totalExpenses[transaction.field] += transaction.amount;
            }
        });

        // Calculate the total expenses across all headings
        const totalAllHeadings = Object.values(totalExpenses).reduce((acc, curr) => acc + curr, 0);

        // Calculate the percentage of expenses covered by each heading
        const expensesCoveredPercentage = {};
        Object.keys(totalExpenses).forEach(heading => {
            // Calculate the percentage
            const percentage = ((totalExpenses[heading] / totalAllHeadings) * 100).toFixed(2);
            expensesCoveredPercentage[heading] = percentage;
        });

        return res.json({ status: "success", data: { totalExpenses, totalAllHeadings, expensesCoveredPercentage } });
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};


module.exports={deleteAll ,deleteAccount, userData , viewTransactions , userRating, feedback , fieldDetails , payOkay , 
    uploadReceiverData , deleteReceiverData , deleteAllReceiverData , viewSummary, bankBalance ,showMoneyToPocket}



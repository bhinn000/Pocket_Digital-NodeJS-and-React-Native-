//register and login logic

// required library
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken") 
const JWT_SECRET=process.env.JWT_SECRET

// required files
const mainBankIDdetails=require("../models/mainBankID");
const accountHolder = require("../models/accountHolder");
const transactionDetail = require("../models/theirAccountActivities");

const register=async (req, res) => {
    const { name, email, phoneNumber, password, mainID } = req.body;
    try {
        // Check if the mainID exists in the mainBankIDdetails collection
        const mainBankIdExists= await mainBankIDdetails.findOne({ mainBankId: mainID });

        if (!mainBankIdExists) {
            return res.send({ status: "not ok", data: "You should have your account in GlobalIME Bank" });
        }

        let uidMainID;
      
            // Generate the UID version of the mainID
            uidMainID = mainID.replace('MBI', 'UID');

            // Check if the UID version of the mainID exists in the accountHolder collection
            const oldUser = await accountHolder.findOne({ userId: uidMainID });
            if (oldUser) {
                return res.send({ status: "not ok", data: "User already existed" });
            }
        
        // Encrypt the password
        const encryptedPwd = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await accountHolder.create({
            name: name,
            email: email,
            userId:uidMainID,
            phoneNumber: phoneNumber,
            password: encryptedPwd,
            mainID: mainID
        });

            // Create a new user in the database
              await transactionDetail.create({
                name: name,
                userId:uidMainID
            });


        // Send the response with the new User ID
        res.send({ status: "ok", data: `User created, your User ID is ${uidMainID || mainID}` });
    } catch (error) {
        console.error(error);
        res.send({ status: "error", data: "An error occurred during registration" });
    }
};


const login = async (req, res) => {
    const { userId, password } = req.body;
    console.log("Received login request with userId:", userId);

    try {
        const userExists = await accountHolder.findOne({ userId: userId });

        if (!userExists) {
            console.log("User not found:", userId);
            return res.status(200).json({ status: "Not available", message: "User doesn't exist" });
        }

        // Check if password matches
        const isPasswordValid = await bcrypt.compare(password, userExists.password);
        if (!isPasswordValid) {
            console.log("Incorrect password for user:", userId);
            return res.status(200).json({ status: "Unauthorized", message: "Invalid password" });
        }

        // Generate JWT token upon successful login
        const token = jwt.sign({ name: userExists.name, userId: userExists.userId }, JWT_SECRET);
        console.log("User found and authenticated:", userId);
        return res.status(200).json({ status: "ok", token: token });

    } catch (err) {
        console.error("Error during login:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { register, login };

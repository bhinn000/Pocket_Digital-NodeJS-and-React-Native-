//register and login logic

const accountHolderDetails = require("../models/accountHolder"); 
const mainBankIDdetails=require("../models/mainBankID")


const register=async (req, res) => {
    const { name, email, phoneNumber, password, mainID } = req.body;
 
    try {
        // Check if the mainID exists in the mainBankIDdetails collection
        const haveMainBankId = await mainBankIDdetails.findOne({ mainBankId: mainID });
        if (!haveMainBankId) {
            return res.send({ status: "not ok", data: "You should have your account in GlobalIME Bank" });
        }

        // Check if the accountHolderDetails collection is empty
        const isAccountHolderDetailsEmpty = (await accountHolderDetails.countDocuments()) === 0;

        let uidMainID;
        if (!isAccountHolderDetailsEmpty) {
            // Generate the UID version of the mainID
            uidMainID = mainID.replace('MID', 'UID');

            // Check if the UID version of the mainID exists in the accountHolder collection
            // const oldUser = await accountHolder.findOne({ userId: uidMainID });
            const oldUser = await accountHolder.findOne({ name: name });
            if (oldUser) {
                return res.send({ status: "not ok", data: "User already existed" });
            }
        }

        // Encrypt the password
        const encryptedPwd = await bcrypt.hash(password, 10);

        // Create a new user in the database
        await accountHolderDetails.create({
            name: name,
            email: email,
            // userId:uidMainID,
            phoneNumber: phoneNumber,
            password: encryptedPwd,
            mainID: mainID
        });

        // Send the response with the new User ID
        res.send({ status: "ok", data: `User created, your User ID is ${uidMainID || mainID}` });
    } catch (error) {
        console.error(error);
        res.send({ status: "error", data: "An error occurred during registration" });
    }
};



const login = async(req,res)=>{
    const {name}=req.body
    console.log("Received login request with name:", name);
    try{
        const userExists=await accountHolderDetails.findOne({name:name})//backend:frontend
        // const userExists=await accountHolderDetails.findOne({name:'Ramun'})//backend:frontend
        if(!userExists){
            console.log("User not found:", name); 
            return res.send({status:"Not available" , data:"User doesn't exist"})
        }
        // Generate JWT token upon successful login
        const token = jwt.sign({ name: userExists.name }, JWT_SECRET);

        console.log("test token name" , token)
        console.log("User found:", name);
        return res.status(200).json({ status: "ok", token: token});
        // return res.status(200).json({ status: "ok", token: token , data:"User exists" });
        // return res.send({status:"ok" , data:"User exists"})
    }
    catch(err){
        console.log(err)
        return res.status(500).send({ error: "Internal server error" });
    }
}

module.exports = { register, login };

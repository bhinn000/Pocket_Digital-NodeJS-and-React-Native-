const jwt=require('jsonwebtoken')
const JWT_SECRET=process.env.JWT_SECRET

const transactionDetail=require("../models/theirAccountActivities")
const accountHolder=require("../models/accountHolder")

const preSettingPOST =  async (req, res) => {
    const { token, budgets } = req.body;
    console.log(token)
    console.log(budgets)
    try {
    
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const userName = decodedToken.name;
        const userId= decodedToken.userId;
        const user = await transactionDetail.findOne({ userId: userId });
        // console.log(user)
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Clear existing   
        user.preSettings = [];
        console.log(user.preSettings)
        budgets.forEach(budget => {
            user.preSettings.push(budget)
        });
        await user.save()
        console.log(user.preSettings)
        return res.status(200).json({ message: "Pre Settings info has been uploaded" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Pre Settings info could not be uploaded" });
    }
};


const preSettingGET =  async (req, res) => {
    // const { token} = req.body;
    // const token = req.headers.authorization.split(' ')[1];
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Authorization header is missing" });
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
    
        const decodedToken = jwt.verify(token, JWT_SECRET); 
        const userName = decodedToken.name;
        const user = await transactionDetail.findOne({ name: userName });
        if (!user) {
            const accountHolderUser = await accountHolder.findOne({ name: userName });
            console.log("Here", accountHolderUser)
            if (accountHolderUser) {
               
                userActivity = new transactionDetail({
                    name: accountHolderUser.name,
                    bankBalance: [],
                    transactionHistory: [],
                    preSettings: []
                });

                await userActivity.save();
            } 
            return res.status(404).json({ error: "User not found" });
        }
        return res.status(200).json(user.preSettings);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Pre Settings info could not be downloadeds" });
    }
};

module.exports={preSettingGET , preSettingPOST}

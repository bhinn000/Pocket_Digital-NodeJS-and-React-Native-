const mainBankIDdetails=require("../models/mainBankID")

const uploadMainBankID=async (req, res) => {
    const data = req.body;

    if (!Array.isArray(data) || data.length === 0) {
        return res.status(400).json({ error: "Request body must be an array of objects." });
    }

    for (const item of data) {
        if (!item.mainBankId || !item.paisa) {
            return res.status(400).json({ error: "Each object must have 'mainBankId' and 'paisa' fields." });
        }
    }

    try {
        await mainBankIDdetails.insertMany(data);
        res.status(201).json({ message: 'Main Bank IDs uploaded successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error.' });
    }
};

module.exports={uploadMainBankID}
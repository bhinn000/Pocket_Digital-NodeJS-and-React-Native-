require('dotenv').config()
const express=require("express")
const app=express()
const mongoose=require("mongoose") 

// Global Middleware
app.use(express.json()) 

const routes=require("./src/routes/route")


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


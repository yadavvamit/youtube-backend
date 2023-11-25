
import connectDB  from "./db/index.js";
import dotenv from "dotenv"
import {app} from "./app.js"
dotenv.config({
    path: './.env'
})

connectDB()

.then(() =>{
    try {
        app.listen(process.env.PORT || 8000, ()=>{
            console.log(`* Server is runing at port : ${process.env.PORT}`);
        })
        
    } catch (error) {
        console.log("ERROR:" , error);
    }
})
.catch((error) =>{
    console.log("MONGO DB connecting failed", error);
})

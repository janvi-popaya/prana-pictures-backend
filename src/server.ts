import "dotenv/config";
import app from "./app";
import {connectDB} from "./config/db.js";

const port = process.env.PORT||5000;
const startserver=async()=>{
    try{
        await connectDB();
        app.listen(port,()=>{
            console.log(`Server is running on port ${port}`);
        });
    }
    catch(error){
        console.error("Error starting server:", error);
        process.exit(1);
    }
    }
    
startserver();

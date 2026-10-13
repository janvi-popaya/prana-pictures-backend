import mongoose from "mongoose";
export async function connectDB(){
    const mongouri=process.env.MONGOURI;
    if(!mongouri){
        throw new Error("MONGOURI is not configured")
    }
    try{
        await mongoose.connect(mongouri);
        console.log("Mongodb connected successfully");
    }
    catch(error){
        console.log("Mongodb connection failed");
        // process.exit(1);
        throw error;
    }
}


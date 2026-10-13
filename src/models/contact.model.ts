import { Schema, model } from "mongoose";

const contactSchema = new Schema(
    {
        name:{
            type:String,
            required:true,
            trim:true,
            maxlength:50
        },
        email:{
            type:String,
            required:true,
            trim:true,
            maxlength:50
        },
        phone:{
            type:String,
            required:true,
            trim:true,
            maxlength:15,
        },
        subject:{
            type:String,
            required:true,
            trim:true,
            maxlength:200
        },
        message:{
            type:String,
            required:true,
            trim:true,
            maxlength:500
        },
        status:{
            type:String,
            enum:["new","read","replied"],  
            default:"new"
        },
    },
    {
        collection:"contact",
        timestamps:true,
    }
);

export const Contact=model("Contact", contactSchema);
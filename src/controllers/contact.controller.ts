import type{ Request, Response,NextFunction } from "express";
import { Contact } from "../models/contact.model.js";
import { verifyRecaptcha } from "../services/recaptcha.service.js";

export async function createContact(req:Request,res:Response, next:NextFunction){
    try{
        const {name,email,phone,subject,message,recaptchaToken}=req.body;
        if(!name||!email||!phone||!subject||!message){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            });
        }
        if(!recaptchaToken){
            return res.status(400).json({
                success:false,
                message:"reCAPTCHA token is required"
            });
        }
        
        const captchaValid=await verifyRecaptcha(recaptchaToken);
        if(!captchaValid){
            return res.status(400).json({
                success:false,
                message:"Invalid reCAPTCHA token"
            });
        }

        const contact=await Contact.create({
            name,email,phone,subject,message
        });
        return res.status(201).json({
            success:true,
            message:"Contact created successfully",
            data:{
                id:contact._id,
            }
        });
    }
    catch(error){
        next(error);
    }
}
    
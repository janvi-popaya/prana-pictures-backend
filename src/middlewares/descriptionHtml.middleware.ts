import type { NextFunction, Request, Response } from "express";
import sanitizeHtml from "sanitize-html";

const sanitizerOptions:sanitizeHtml.IOptions={
    allowedTags:[
        "p",
    "br",
    "strong",
    "b",
    "em",
    "i",
    "u",
    "s",
    "ul",
    "ol",
    "li",
    "blockquote",
    "h2",
    "h3",
    "h4",
    "a",
    ],

    allowedAttributes: { a: ["href", "target", "rel"], },

    allowedSchemes: ["http", "https", "mailto"],

    allowProtocolRelative: false,

    transformTags: {
        a: sanitizeHtml.simpleTransform(
        "a",
        {
            rel: "noopener noreferrer",
        },
        true,
        ),
    },
};

export function sanitizeDescriptionHtml(req:Request,res:Response,next:NextFunction){
    if(typeof req.body.descriptionHtml !=="string"){
        next();
        return;
    }

    if(req.body.descriptionHtml.trim()===""){
        req.body.descriptionHtml="";
        next();
        return;
    }

    const cleanedHtml = sanitizeHtml(
    req.body.descriptionHtml,
    sanitizerOptions,
  ).trim();

  const readableText = sanitizeHtml(cleanedHtml, {
    allowedTags: [],
    allowedAttributes: {},
  }).trim();

  if (!readableText) {
    res.status(400).json({
      success: false,
      message: "Description must contain readable text",
    });
    return;
  }
  req.body.descriptionHtml = cleanedHtml;

  next();
  
}
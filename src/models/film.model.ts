import {Schema,model} from "mongoose";

const optionalUrl={
    validator(value?:string){
        return !value || /^https?:\/\/\S+$/i.test(value);
    },
    message:"Please provide a valid URL"
};

const socialLinkSchema = new Schema(
  {
    platform: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      maxlength: 50,
    },
    url: {
      type: String,
      required: true,
      trim: true,
      validate: optionalUrl,
    },
    sortOrder: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    _id: false,
  },
);

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    metaKeywords: {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 60,
        },
      ],
      default: [],
    },
  },
  {
    _id: false,
  },
);

const filmSchema=new Schema(
    {
        title:{
            type:String,
            trim:true,
            required:true,
            maxlength:100
        },
        descriptionHtml:{
            type:String,
            required:true,
            trim:true,
            maxlength:5000
        },
        shortDescription:{
            type:String,
            trim:true,
            maxlength:500,
        },
        slug:
        {
            type:String,
            unique:true,
            required:true,
            trim:true,
            maxlength:100,
            lowercase:true,
             match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers and hyphens only",
      ],
    },
    genres: 
    {
      type: [
        {
          type: String,
          trim: true,
          maxlength: 50,
        },
      ],
      required: true,
      validate: {
        validator(genres: string[]) {
          return genres.length > 0;
        },
        message: "At least one genre is required",
      },
    },
        cast:{
            type:String,
            trim:true,
            maxlength:2000
        },
        directedBy:{
            type:String,
            trim:true,
            maxlength:200
        },
        writtenBy:{
            type:String,
            trim:true,
            maxlength:500
        },
        musicBy:{
            type:String,
            trim:true,
            maxlength:500
        },
        producedBy:{
            type:String,
            trim:true,
            maxlength:300
        },
        releaseAndScreening:{
            type:String,
            trim:true,
            maxlength:5000   
        },
        awards:{
            type:String,
            trim:true,
            maxlength:2000
        },
        imdbUrl:{
            type:String,
            trim:true,
            maxlength:500,
            validate: optionalUrl,
        },
        letterboxdUrl:{
            type:String,
            trim:true,
            maxlength:500,
            validate: optionalUrl,
        },
        language:{
            type:String,
            trim:true,
            maxlength:100,
            default:"English",
        },
        basedOn:{
            type:String,
            trim:true,
            maxlength:200
        },
        releaseDate:{
            type:Date,
            required:true,
        },
        runtimeMinutes:{
            type:Number,
            required:true,
            min:1,
        },
        trailerUrl:{
            type:String,
            trim:true,
            maxlength:500,
            validate: optionalUrl,
        },
        sortOrder:{
            type:Number,
            required:true,
            default:0,
            min:0,
        },
        status:{
            type:String,
            enum:["enabled","disabled","upcoming"],
            default:"enabled"
        },
        socialLinks:{
            type:[socialLinkSchema],
            default:[]
        },
        seo:{
            type:seoSchema,
            default:()=>({}),
        },
    },
    {
        collection:"films",
        timestamps:true,
    }
);

filmSchema.index({status:1,sortOrder:1});

export const Film=model("Film",filmSchema);

import { Schema, model } from "mongoose";

const seoSchema = new Schema(
  {
    metaTitle: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    metaDescription: {
      type: String,
      trim: true,
      maxlength: 300,
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

const informationSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 150,
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug must contain lowercase letters, numbers and hyphens only",
      ],
    },

    descriptionHtml: {
      type: String,
      trim: true,
      maxlength: 10000,
    },

    icon: {
      type: String,
      trim: true,
      maxlength: 100,
    },

    showInFooter: {
      type: Boolean,
      default: false,
    },

    sortOrder: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["enabled", "disabled"],
      default: "enabled",
    },

    seo: {
      type: seoSchema,
      required: true,
    },
  },
  {
    collection: "information",
    timestamps: true,
  },
);

informationSchema.index({
  status: 1,
  sortOrder: 1,
});

informationSchema.index({
  status: 1,
  showInFooter: 1,
  sortOrder: 1,
});

export const InformationPage = model(
  "InformationPage",
  informationSchema,
);
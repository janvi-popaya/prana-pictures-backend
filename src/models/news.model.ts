import { Schema, model } from "mongoose";

const optionalUrl = {
  validator(value?: string) {
    return !value || /^https?:\/\/\S+$/i.test(value);
  },
  message: "Please provide a valid HTTP or HTTPS URL",
};

const newsSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    url: {
      type: String,
      trim: true,
      maxlength: 500,
      validate: optionalUrl,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
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
  },
  {
    collection: "news",
    timestamps: true,
  },
);

newsSchema.index({
  status: 1,
  sortOrder: 1,
});

export const News = model("News", newsSchema);
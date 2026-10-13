import { Schema, model } from "mongoose";

const optionalUrl = {
  validator(value?: string) {
    return !value || /^https?:\/\/\S+$/i.test(value);
  },
  message: "Please provide a valid URL",
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
      maxlength: 500,
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

const skillsSchema = new Schema(
  {
    technicalSolutioning: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    projectManagement: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    businessDevelopment: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    peopleManagement: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    _id: false,
  },
);

const teamMemberSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    shortBio: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    descriptionHtml: {
      type: String,
      trim: true,
      maxlength: 5000,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 254,
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

    socialLinks: {
      type: [socialLinkSchema],
      default: [],
    },

    skills: {
      type: skillsSchema,
      default: () => ({}),
    },
  },
  {
    collection: "team_members",
    timestamps: true,
  },
);

teamMemberSchema.index({
  status: 1,
  sortOrder: 1,
});

export const TeamMember = model("TeamMember", teamMemberSchema);
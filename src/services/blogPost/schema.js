import mongoose from "mongoose";

const { Schema, model } = mongoose;

const blogPostSchema = new Schema(
  {
    category: { type: String, required: true },
    title: { type: String, required: true },
    cover: { type: String, required: true },
    readTime: {
      type: Object,
      required: true,
      nested: {
        value: { type: Number, required: false },
        unit: { type: String, default: "minutes" },
      },
    },
    author: {
      type: Object,
      required: true,
      nested: {
        name: { type: String, required: true },
        avatar: { type: String, required: false },
      },
    },
    content: { type: String, required: true },
    Comments: [
      {
        name: { type: String },
        comment: { type: String },
        commentDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

export default model("blogPost", blogPostSchema);

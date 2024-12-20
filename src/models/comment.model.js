import { Schema, model } from "mongoose";
const { ObjectId } = Schema.Types;

const CommentSchema = new Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Comment's author is required"],
    },
    content: {
      type: String,
      required: [true, "Comment's content is required"],
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    parentComment: {
      type: ObjectId,
      ref: "Comment",
    },
    article: {
      type: ObjectId,
      ref: "Article",
      required: [true, "Comment must belong to an article"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = model("Comment", CommentSchema);

export default Comment;

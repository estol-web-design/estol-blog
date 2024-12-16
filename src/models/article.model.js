import { Schema, model } from "mongoose";
import { convertToHtml, convertToMarkdown } from "../utils/contentConvertion.helper";
const { ObjectId } = Schema.Types;

const ArticleSchema = new Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Article's author is required"],
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    title: {
      type: String,
      required: [true, "Article's title is required"],
    },
    mainImg: {
      type: String,
      validate: {
        validator: function (v) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
        },
        message: "Invalid image URL",
      },
    },
    content: {
      type: String,
      required: [true, "Article's content is required"],
    },
    likes: [
      {
        type: ObjectId,
        ref: "User",
      },
    ],
    views: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        type: ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

ArticleSchema.pre("save", function (next) {
  if (this.isModified("content") && this.content) {
    this.content = convertToMarkdown(this.content);
  }
  next();
});

ArticleSchema.methods.toMarkdown = function () {
  try {
    return convertToMarkdown(this.content)
  } catch (err) {
    console.error("Html to markdown convertion error:", err);
    return null;
  }
};

ArticleSchema.virtual("htmlContent").get(function () {
  try {
    return convertToHtml(this.content)
  } catch (err) {
    console.error("Error converting content to HTML:", err);
    return null;
  }
});

ArticleSchema.set("toJSON", { virtuals: true, transform: (doc, ret) => {
  delete ret.content;
  delete ret.id;
  return ret;
}, });

const Article = model("Article", ArticleSchema);

export default Article;

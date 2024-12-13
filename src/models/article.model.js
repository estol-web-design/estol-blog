import { Schema, model } from "mongoose";
import TurndownService from "turndown";
import { marked } from "marked";
const { ObjectId } = Schema.Types;

const turndownService = new TurndownService();

const ArticleSchema = new Schema(
  {
    author: {
      type: ObjectId,
      ref: "User",
      required: [true, "Article's author is required"],
    },
    title: {
      type: String,
      required: [true, "Article's title is required"],
    },
    mainImg: {
      type: String,
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
    softDelete: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

ArticleSchema.pre("save", function (next) {
  this.content = turndownService.turndown(this.content);
  next();
});

ArticleSchema.methods.toMarkdown = function () {
  return turndownService.turndown(this.content);
}

ArticleSchema.methods.toHtml = function () {
  return marked(this.content);
};

const Article = model("Article", ArticleSchema);

export default Article;

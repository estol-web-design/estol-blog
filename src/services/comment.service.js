import Comment from "../models/comment.model.js";
import ArticleService from "./article.service.js";

const CommentService = {
  create: async ({ data }) => {
    const newComment = await Comment.create(data);
    await ArticleService.addCommentToArticle({ id: data.article, comment: newComment._id });

    return newComment;
  },

  delete: async ({ id }) => {
    const comment = await Comment.findById(id);
    comment.deleted = true;
    comment.save();

    return comment;
  },

  update: async ({ content }) => {
    const comment = await Comment.findById(id);
    comment.content = content;
    comment.save();

    return comment;
  },

  getArticleComments: async ({ article }) => {
    const comments = await Comment.find({ article });

    return comments;
  },
};

export default CommentService;

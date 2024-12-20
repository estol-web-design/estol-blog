import Article from "../models/article.model.js";
import { articlePopulation } from "../utils/articlePopulation.util.js";
import CommentService from "./comment.service.js";

const ArticleService = {
  create: async ({ data }) => {
    const newArticle = new Article(data);
    await newArticle.save();

    return newArticle;
  },

  softDelete: async ({ id }) => {
    const article = await Article.findById(id);
    article.isDeleted = !article.isDeleted;
    await article.save();

    return article;
  },

  hardDelete: async ({ id }) => {
    const hardDeletedArticle = await Article.findByIdAndDelete(id);

    await CommentService.deleteArticleComments({
      article: hardDeletedArticle._id,
    });

    return hardDeletedArticle;
  },

  update: async ({ id, data }) => {
    const article = await Article.findById(id);

    if (data.title) article.title = data.title;
    if (data.content) {
      article.content = article.toMarkdown.call({ content: data.content });
    }
    if (data.mainImg) article.mainImg = data.mainImg;

    article.save();

    return article;
  },

  publishManagment: async ({ id }) => {
    const article = await Article.findById(id);
    article.published = !article.published;
    article.save();

    return article;
  },

  getArticle: async ({ id }) => {
    const article = await Article.findById(id).populate(articlePopulation);

    return article;
  },

  getLastArticles: async ({ limit }) => {
    const articles = await Article.find({ published: true })
      .populate(articlePopulation)
      .sort("-createdAt")
      .limit(limit ? limit : 10);

    return articles;
  },

  addCommentToArticle: async ({ id, comment }) => {
    const article = await Article.findById(id);
    article.comments.push(comment);
    await article.save();
    return true;
  },
};

export default ArticleService;

import Article from "../models/article.model.js";
import { articlePopulation } from "../utils/articlePopulation.helper.js";

const ArticleService = {
  create: async ({ data }) => {
    const newArticle = new Article(data);
    await newArticle.save();

    return newArticle;
  },

  softDelete: async ({ id }) => {
    const softDeletedArticle = await Article.findById(id);
    softDeletedArticle.softDelete = true;
    await softDeletedArticle.save();

    return softDeletedArticle;
  },

  hardDelete: async ({ id }) => {
    const hardDeletedArticle = await Article.findByIdAndDelete(id);

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
    const plainArticle = article.toObject();

    plainArticle.content = article.toHtml();

    return plainArticle;
  },

  getLastArticles: async ({ limit }) => {
    const articles = await Article.find({ published: true })
      .populate(articlePopulation)
      .sort("-createdAt")
      .limit(limit ? limit : 10)
      .lean({ virtuals: true });

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

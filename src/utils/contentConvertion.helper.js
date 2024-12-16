import TurndownService from "turndown";
import { marked } from "marked";

const turndownService = new TurndownService();
marked.setOptions({ breaks: true, gfm: true });

export const convertToMarkdown = (htmlContent) => {
  try {
    return turndownService.turndown(htmlContent);
  } catch (err) {
    console.error("HTML to markdown conversion error:", err);
    return null;
  }
};

export const convertToHtml = (markdownContent) => {
  try {
    return marked(markdownContent);
  } catch (err) {
    console.error("Markdown to HTML conversion error:", err);
    return null;
  }
};

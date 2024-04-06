import {
  Article,
  ArticleId,
  ArticleTag,
  ArticleTagId,
  I18nText,
  Language,
  Paragraph,
  ParagraphId,
  ParagraphTag,
  ParagraphTagId,
  Priority,
  Tag,
  TagCategory,
  TagCategoryId,
  TagId,
  TagTarget,
} from "p44-types";

export const METHODS: (keyof P44Api)[] = [
  "addArticle",
  "addArticleTag",
  "addParagraph",
  "addParagraphTag",
  "addTag",
  "addTagCategory",
  "getArticle",
  "getParagraph",
  "getTag",
  "getTagCategory",
  "listArticleTags",
  "listArticles",
  "listLanguages",
  "listParagraphs",
  "listParagraphTags",
  "listTagCategories",
  "listTags",
  "removeArticle",
  "removeArticleTag",
  "removeParagraph",
  "removeParagraphTag",
  "removeTag",
  "removeTagCategory",
  "updateArticle",
  "updateParagraph",
  "updateTag",
  "updateTagCategory",
];

export type P44Api = {
  listLanguages(): Promise<Language[]>;

  addTag(categoryId: TagCategoryId): Promise<TagId>;
  getTag(id: TagId): Promise<Tag>;
  listTags(categoryId: TagCategoryId): Promise<Tag[]>;
  updateTag(
    id: TagId,
    label: I18nText,
    description: I18nText,
    priority: Priority,
  ): Promise<void>;
  removeTag(id: TagId): Promise<void>;

  addTagCategory(): Promise<TagCategoryId>;
  getTagCategory(id: TagCategoryId): Promise<TagCategory>;
  listTagCategories(): Promise<TagCategory[]>;
  updateTagCategory(
    id: TagCategoryId,
    label: I18nText,
    description: I18nText,
    target: TagTarget[],
    priority: Priority,
  ): Promise<void>;
  removeTagCategory(id: TagCategoryId): Promise<void>;

  addParagraphTag(
    paragraphId: ParagraphId,
    tagId: TagId,
  ): Promise<ParagraphTagId>;
  listParagraphTags(paragraphId: ParagraphId): Promise<ParagraphTag[]>;
  removeParagraphTag(id: ParagraphTagId): Promise<void>;

  addParagraph(articleId: ArticleId): Promise<ParagraphId>;
  getParagraph(id: ParagraphId): Promise<Paragraph>;
  listParagraphs(articleId: ArticleId): Promise<Paragraph[]>;
  updateParagraph(
    id: ParagraphId,
    text: I18nText,
    draft: boolean,
  ): Promise<void>;
  removeParagraph(id: ParagraphId): Promise<void>;

  addArticleTag(articleId: ArticleId, tagId: TagId): Promise<ArticleTagId>;
  listArticleTags(articleId: ArticleId): Promise<ArticleTag[]>;
  removeArticleTag(id: ArticleTagId): Promise<void>;

  addArticle(): Promise<ArticleId>;
  getArticle(id: ArticleId): Promise<Article>;
  listArticles(): Promise<Article[]>;
  updateArticle(
    id: ArticleId,
    title: I18nText,
    priority: Priority,
    draft: boolean,
  ): Promise<void>;
  removeArticle(id: ArticleId): Promise<void>;
};

import {
  Tag,
  I18nText,
  Priority,
  TagCategory,
  TagTarget,
  ParagraphTag,
  Paragraph,
  ArticleTag,
  Article,
  TagId,
  TagCategoryId,
  Language,
  ParagraphId,
  ParagraphTagId,
  ArticleId,
  type ArticleTagId,
} from "p44-types";
import { P44Api } from "./p44-api";
import { Io } from "../io/io";

const VALUE = "value";
const NEXT_TAG_ID = "next-tag-id";
const NEXT_TAG_CATEGORY_ID = "next-tag-category-id";
const NEXT_PARAGRAPH_ID = "next-paragraph-id";
const NEXT_PARAGRAPH_TAG_ID = "next-paragraph-tag-id";
const NEXT_ARTICLE_ID = "next-article-id";
const NEXT_ARTICLE_TAG_ID = "next-article-tag-id";
const TAG = "tag";
const ARTICLE = "article";
const ARTICLE_TAG = "article-tag";
const PARAGRAPH = "paragraph";
const PARAGRAPH_TAG = "paragraph-tag";
const TAG_CATEGORY = "tag-category";
const LANGUAGES = "languages";

export class P44ApiImpl implements P44Api {
  private languages: Language[] = [];
  private nullText: I18nText = {} as any;
  private nullPriority: Priority = null;

  constructor(private readonly io: Io) {}

  async init() {
    this.languages = await this.io.read<Language[]>(VALUE, LANGUAGES);
    this.languages.forEach((l) => {
      this.nullText[l] = null;
    });
  }

  private async increase(key: string): Promise<number> {
    const id = await this.io.read(VALUE, key, 1);
    await this.io.write(VALUE, key, id + 1, true);
    return id;
  }

  async listLanguages(): Promise<Language[]> {
    return this.languages;
  }

  async addTag(categoryId: TagCategoryId): Promise<TagCategoryId> {
    const id = await this.increase(NEXT_TAG_ID);
    await this.io.write<Tag>(
      TAG,
      id,
      {
        id,
        description: this.nullText,
        label: this.nullText,
        priority: this.nullPriority,
        categoryId,
      },
      false,
    );
    return id;
  }

  listTags(): Promise<Tag[]> {
    return this.io.readAll(TAG);
  }

  private async mutate<T>(col: any, id: any, m: Partial<T>) {
    const v = await this.io.read<any>(col, id);
    Object.assign(v, m);
    await this.io.write(col, id, v, true);
  }

  async updateTag(
    id: TagId,
    label: I18nText,
    description: I18nText,
    priority: Priority,
  ): Promise<void> {
    return this.mutate<Tag>(TAG, id, { label, description, priority });
  }

  removeTag(id: number): Promise<void> {
    return this.io.delete(TAG, id);
  }

  async addTagCategory(): Promise<number> {
    const id = await this.increase(NEXT_TAG_CATEGORY_ID);
    await this.io.write<TagCategory>(
      TAG_CATEGORY,
      id,
      {
        id,
        description: this.nullText,
        label: this.nullText,
        priority: this.nullPriority,
        target: [],
      },
      false,
    );
    return id;
  }

  listTagCategories(): Promise<TagCategory[]> {
    return this.io.readAll(TAG_CATEGORY);
  }

  async updateTagCategory(
    id: TagCategoryId,
    label: I18nText,
    description: I18nText,
    target: TagTarget[],
    priority: Priority,
  ): Promise<void> {
    return this.mutate<TagCategory>(TAG_CATEGORY, id, {
      label,
      description,
      target,
      priority,
    });
  }

  removeTagCategory(id: TagCategoryId): Promise<void> {
    return this.io.delete(TAG_CATEGORY, id);
  }

  async addParagraphTag(
    paragraphId: ParagraphId,
    tagId: TagId,
  ): Promise<ParagraphTagId> {
    const id = await this.increase(NEXT_PARAGRAPH_TAG_ID);
    await this.io.write<ParagraphTag>(
      PARAGRAPH_TAG,
      id,
      { id, paragraphId, tagId },
      false,
    );
    return id;
  }

  async listParagraphTags(paragraphId: ParagraphId): Promise<ParagraphTag[]> {
    const tags = await this.io.readAll<ParagraphTag>(PARAGRAPH_TAG);
    return tags.filter((v) => v.paragraphId === paragraphId);
  }

  async removeParagraphTag(id: ParagraphTagId): Promise<void> {
    return this.io.delete(PARAGRAPH_TAG, id);
  }

  async addParagraph(articleId: ArticleId): Promise<ParagraphId> {
    const id = await this.increase("nextParagraphId");
    await this.io.write<Paragraph>(
      PARAGRAPH,
      id,
      {
        id,
        articleId,
        createdAt: now(),
        updatedAt: now(),
        draft: true,
        text: this.nullText,
      },
      false,
    );
    return id;
  }

  async listParagraphs(articleId: ArticleId): Promise<Paragraph[]> {
    const paragraphs = await this.io.readAll<Paragraph>(PARAGRAPH);
    return paragraphs.filter((it) => (it.articleId = articleId));
  }

  async updateParagraph(
    id: ParagraphId,
    text: I18nText,
    draft: boolean,
  ): Promise<void> {
    return this.mutate<Paragraph>(PARAGRAPH, id, { text, draft });
  }

  async removeParagraph(id: ParagraphId): Promise<void> {
    return this.io.delete(PARAGRAPH, id);
  }

  async addArticleTag(
    articleId: ArticleId,
    tagId: TagId,
  ): Promise<ArticleTagId> {
    const id = await this.increase(NEXT_ARTICLE_TAG_ID);
    await this.io.write<ArticleTag>(
      ARTICLE_TAG,
      id,
      { id, articleId, tagId },
      false,
    );
    return id;
  }

  async listArticleTags(articleId: ArticleId): Promise<ArticleTag[]> {
    const tags = await this.io.readAll<ArticleTag>(ARTICLE_TAG);
    return tags.filter((it) => (it.articleId = articleId));
  }

  async removeArticleTag(id: ArticleTagId): Promise<void> {
    return this.io.delete(ARTICLE_TAG, id);
  }

  async addArticle(): Promise<number> {
    const id = await this.increase(NEXT_ARTICLE_ID);
    await this.io.write<Article>(
      ARTICLE,
      id,
      {
        createdAt: now(),
        draft: true,
        id,
        priority: this.nullPriority,
        title: this.nullText,
        updatedAt: now(),
      },
      false,
    );
    return id;
  }

  async listArticles(): Promise<Article[]> {
    return this.io.readAll(ARTICLE);
  }

  async updateArticle(
    id: number,
    title: I18nText,
    priority: Priority,
    draft: boolean,
  ): Promise<void> {
    return this.mutate<Article>(ARTICLE, id, { title, priority, draft });
  }

  async removeArticle(id: number): Promise<void> {
    return this.io.delete(ARTICLE, id);
  }
}

function now() {
  return Math.floor(Date.now() / 1000);
}

import type {
  Tag,
  I18nText,
  TagCategory,
  TagTarget,
  ParagraphTag,
  Paragraph,
  ArticleTag,
  Article,
  Language,
  TagCategoryId,
  TagId,
  Priority,
} from "p44-types";
import type { P44Api } from "./p44-api";
import BetterSqlite3, { type Database } from "better-sqlite3";

export class SqliteP44Api implements P44Api {
  private db: Database;
  private languages: Language[];
  private defaultI18nText: string;
  private defaultTarget = "[]";
  private defaultPriority: Priority = 100;

  constructor(filename: string) {
    this.db = new BetterSqlite3(filename, { verbose: console.log });
    migrations.forEach((m) => {
      Object.entries(aliases).forEach(([k, v]) => {
        m = m.replaceAll(`_${k}_`, v);
      });
      this.db.exec(m);
    });
    this.languages = this.db
      .prepare("select * from `language`")
      .all()
      .map((v: any) => v.id);

    const i18n = {} as any;
    this.languages.forEach((l) => {
      i18n[l] = "";
    });
    this.defaultI18nText = JSON.stringify(i18n);
  }

  async listLanguages(): Promise<Language[]> {
    return this.languages;
  }

  async addTag(categoryId: TagCategoryId): Promise<TagId> {
    const r = this.db
      .prepare(
        "insert into `tag`(`category_id`,`label`,`description`,`priority`) values(?,?,?,?)",
      )
      .run(
        categoryId,
        this.defaultI18nText,
        this.defaultI18nText,
        this.defaultPriority,
      );
    return Number(r.lastInsertRowid);
  }

  async getTag(id: TagId): Promise<Tag> {
    const tag = this.db
      .prepare("select * from `tag` where `id` = ?")
      .get(id) as any;
    return {
      id: tag.id,
      categoryId: tag.category_id,
      description: JSON.parse(tag.description),
      label: JSON.parse(tag.label),
      priority: tag.priority,
    };
  }

  async listTags(categoryId: number): Promise<Tag[]> {
    return this.db
      .prepare("select * from `tag` where `category_id` = ?")
      .all(categoryId)
      .map((r: any) => ({
        id: r.id,
        categoryId: r.category_id,
        description: JSON.parse(r.description),
        label: JSON.parse(r.label),
        priority: r.priority,
      }));
  }

  async updateTag(
    id: number,
    label: I18nText,
    description: I18nText,
    priority: number,
  ): Promise<void> {
    mustChange(
      this.db
        .prepare(
          "update `tag` set `label` = ?, `description` = ?, `priority` = ? where `id` = ?",
        )
        .run(JSON.stringify(label), JSON.stringify(description), priority, id),
    );
  }

  async removeTag(id: number): Promise<void> {
    mustChange(this.db.prepare("delete from `tag` where `id` = ?").run(id));
  }

  async addTagCategory(): Promise<number> {
    return Number(
      this.db
        .prepare(
          "insert into `tag_category`(`label`,`description`,`target`,`priority`) values(?,?,?,?)",
        )
        .run(
          this.defaultI18nText,
          this.defaultI18nText,
          this.defaultTarget,
          this.defaultPriority,
        ).lastInsertRowid,
    );
  }

  async getTagCategory(id: number): Promise<TagCategory> {
    const t = this.db
      .prepare("select * from `tag_category` where `id` = ?")
      .get(id) as any;
    return {
      id: t.id,
      description: JSON.parse(t.description),
      label: JSON.parse(t.label),
      priority: t.priority,
      target: JSON.parse(t.target),
    };
  }

  async listTagCategories(): Promise<TagCategory[]> {
    return this.db
      .prepare("select * from `tag_category`")
      .all()
      .map((v: any) => ({
        id: v.id,
        description: JSON.parse(v.description),
        label: JSON.parse(v.label),
        priority: v.priority,
        target: JSON.parse(v.target),
      }));
  }

  async updateTagCategory(
    id: number,
    label: I18nText,
    description: I18nText,
    target: TagTarget[],
    priority: number,
  ): Promise<void> {
    mustChange(
      this.db
        .prepare(
          "update `tag_category` set `label` = ?, `description` = ?, `target` = ?, `priority` = ? where `id`=?",
        )
        .run(
          JSON.stringify(label),
          JSON.stringify(description),
          JSON.stringify(target),
          priority,
          id,
        ),
    );
  }

  async removeTagCategory(id: number): Promise<void> {
    mustChange(
      this.db.prepare("delete from `tag_category` where `id` = ?").run(id),
    );
  }

  async addParagraphTag(paragraphId: number, tagId: number): Promise<number> {
    return Number(
      this.db
        .prepare(
          "insert into `paragraph_tag`(`paragraph_id`,`tag_id`) values(?,?)",
        )
        .run(paragraphId, tagId).lastInsertRowid,
    );
  }

  async listParagraphTags(paragraphId: number): Promise<ParagraphTag[]> {
    return this.db
      .prepare("select * from `paragraph_tag` where `paragraph_id` = ?")
      .all(paragraphId)
      .map((v: any) => ({
        id: v.id,
        paragraphId: v.paragraph_id,
        tagId: v.tag_id,
      }));
  }

  async removeParagraphTag(id: number): Promise<void> {
    mustChange(
      this.db.prepare("delete from `paragraph_tag` where `id` = ?").run(id),
    );
  }

  async addParagraph(articleId: number): Promise<number> {
    return Number(
      this.db
        .prepare(
          "insert into `paragraph`(`article_id`,`text`,`draft`,`created_at`,`updated_at`) values(?,?,?,?,?)",
        )
        .run(articleId, this.defaultI18nText, 1, unix(), unix())
        .lastInsertRowid,
    );
  }

  async getParagraph(id: number): Promise<Paragraph> {
    const v = this.db
      .prepare("select * from `paragraph` where `id` =?")
      .get(id) as any;
    return {
      id: v.id,
      articleId: v.article_id,
      createdAt: v.created_at,
      updatedAt: v.updated_at,
      draft: bool(v.draft),
      text: JSON.parse(v.text),
    };
  }

  async listParagraphs(articleId: number): Promise<Paragraph[]> {
    return this.db
      .prepare("select * from `paragraph` where `article_id` = ?")
      .all(articleId)
      .map((v: any) => ({
        id: v.id,
        articleId: v.article_id,
        createdAt: v.created_at,
        updatedAt: v.updated_at,
        draft: bool(v.draft),
        text: JSON.parse(v.text),
      }));
  }

  async updateParagraph(
    id: number,
    text: I18nText,
    draft: boolean,
  ): Promise<void> {
    mustChange(
      this.db
        .prepare(
          "update `paragraph` set `text`=?, `draft`=?,`updated_at`=? where `id` = ?",
        )
        .run(JSON.stringify(text), draft ? 1 : 0, unix(), id),
    );
  }

  async removeParagraph(id: number): Promise<void> {
    mustChange(
      this.db.prepare("delete from `paragraph` where `id` = ?").run(id),
    );
  }

  async addArticleTag(articleId: number, tagId: number): Promise<number> {
    return Number(
      this.db
        .prepare("insert into `article_tag`(`article_id`,`tag_id`) values(?,?)")
        .run(articleId, tagId).lastInsertRowid,
    );
  }

  async listArticleTags(articleId: number): Promise<ArticleTag[]> {
    return this.db
      .prepare("select * from `article_tag` where `article_id` = ?")
      .all(articleId)
      .map((v: any) => ({
        id: v.id,
        articleId: v.article_id,
        tagId: v.tag_id,
      }));
  }

  async removeArticleTag(id: number): Promise<void> {
    mustChange(
      this.db.prepare("delete from `article_tag` where `id` = ?").run(id),
    );
  }

  async addArticle(): Promise<number> {
    return Number(
      this.db
        .prepare(
          "insert into `article`(`title`,`priority`,`draft`,`created_at`,`updated_at`) values(?,?,?,?,?)",
        )
        .run(this.defaultI18nText, this.defaultPriority, 1, unix(), unix())
        .lastInsertRowid,
    );
  }

  async getArticle(id: number): Promise<Article> {
    const v = this.db
      .prepare("select * from `article` where `id` = ?")
      .get(id) as any;
    return {
      id: v.id,
      createdAt: v.created_at,
      draft: bool(v.draft),
      priority: v.priority,
      title: JSON.parse(v.title),
      updatedAt: v.updated_at,
    };
  }

  async listArticles(): Promise<Article[]> {
    return this.db
      .prepare("select * from `article`")
      .all()
      .map((v: any) => ({
        id: v.id,
        createdAt: v.created_at,
        draft: bool(v.draft),
        priority: v.priority,
        title: JSON.parse(v.title),
        updatedAt: v.updated_at,
      }));
  }

  async updateArticle(
    id: number,
    title: I18nText,
    priority: number,
    draft: boolean,
  ): Promise<void> {
    mustChange(
      this.db
        .prepare(
          "update `article` set `title` =?, `priority`=?,`draft`=?,`updated_at`=? where `id`=?",
        )
        .run(JSON.stringify(title), priority, draft ? 1 : 0, unix(), id),
    );
  }

  async removeArticle(id: number): Promise<void> {
    mustChange(this.db.prepare("delete from `article` where `id` = ?").run(id));
  }
}

function mustChange(v: { changes: number }) {
  if (v.changes === 0) {
    throw new Error("no changes");
  }
}

function unix(): number {
  return Math.floor(Date.now() / 1000);
}

function bool(v: number) {
  switch (v) {
    case 0:
      return false;
    case 1:
      return true;
  }
  throw new Error(`${v} is not bool`);
}

const aliases = {
  CT: "create table if not exists",
  AI: "integer primary key autoincrement",
  I: "integer not null",
  T: "text not null",
};

const migrations: string[] = [
  "_CT_ `language` (`id` text primary key)",
  "insert into `language`(`id`) values('en'),('ko') on conflict do nothing",
  "_CT_ `tag_category` (`id` _AI_, `label` _T_, `description` _T_, `target` _T_, `priority` _I_)",
  "_CT_ `tag`(`id` _AI_, `category_id` _I_, `label` _T_, `description` _T_, `priority` _I_)",
  "_CT_ `paragraph`(`id` _AI_, `article_id` _I_, `text` _T_, `draft` _I_, `created_at` _I_, `updated_at` _I_)",
  "_CT_ `paragraph_tag`(`id` _AI_, `paragraph_id` _I_, `tag_id` _I_)",
  "_CT_ `article`(`id` _AI_, `title` _T_, `priority` _I_, `draft` _I_, `created_at` _I_, `updated_at` _I_)",
  "_CT_ `article_tag`(`id` _AI_, `article_id` _I_, `tag_id` _I_)",
];

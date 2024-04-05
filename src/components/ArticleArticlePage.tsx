import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../hooks/api";
import { useState } from "react";
import { I18nTextInput } from "./common/I18nTextInput";
import { BoolInput } from "./common/BoolInput";
import { IntInput } from "./common/IntInput";
import { SafeButton } from "./common/SafeButton";
import type { ArticleTag } from "p44-types";

export function ArticleArticlePage() {
  const articleId = parseInt(useParams()["id"]!, 10);
  const article = useApiQuery("getArticle", [articleId]).data;
  const [title, setTitle] = useState(article.title);
  const [draft, setDraft] = useState(article.draft);
  const [priority, setPriority] = useState(article.priority);
  const updateMutation = useApiMutation("updateArticle");
  const removeMutation = useApiMutation("removeArticle");
  const articleTags = useApiQuery("listArticleTags", [articleId]).data;
  return (
    <div>
      <I18nTextInput label="title" v={title} s={setTitle} />
      <BoolInput label="draft" v={draft} s={setDraft} />
      <IntInput label="priority" v={priority} s={setPriority} />
      <button
        onClick={() => {
          updateMutation.mutate([articleId, title, priority, draft]);
        }}
      >
        Update
      </button>
      <SafeButton
        onClick={() => {
          removeMutation.mutate([articleId]);
        }}
      >
        Remove
      </SafeButton>
      {articleTags.map((it) => (
        <ArticleTagView key={it.id} v={it} />
      ))}
    </div>
  );
}

function ArticleTagView(props: { v: ArticleTag }) {
  return <div></div>;
}

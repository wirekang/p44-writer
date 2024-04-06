import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../hooks/api";
import { useState } from "react";
import { I18nTextInput } from "./common/I18nTextInput";
import { BoolInput } from "./common/BoolInput";
import { IntInput } from "./common/IntInput";
import { SafeButton } from "./common/SafeButton";
import { TagSelector } from "./TagSelector";
import { TagView } from "./TagView";
import type { ArticleId, ParagraphId } from "p44-types";

export function ArticleArticlePage() {
  const articleId = parseInt(useParams()["id"]!, 10);
  const article = useApiQuery("getArticle", [articleId]).data;
  const [title, setTitle] = useState(article.title);
  const [draft, setDraft] = useState(article.draft);
  const [priority, setPriority] = useState(article.priority);
  const updateMutation = useApiMutation("updateArticle");
  const removeMutation = useApiMutation("removeArticle");
  const articleTags = useApiQuery("listArticleTags", [articleId]).data;
  const addTagMutation = useApiMutation("addArticleTag");
  const removeTagMutation = useApiMutation("removeArticleTag");
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
      <TagView
        v={articleTags}
        onRemove={(v) => {
          removeTagMutation.mutate([v]);
        }}
      />
      <TagSelector
        onAdd={(tagId) => {
          addTagMutation.mutate([articleId, tagId]);
        }}
      />
      <ParagraphView articleId={articleId} />
    </div>
  );
}

function ParagraphView(props: { articleId: ArticleId }) {
  const paragraphs = useApiQuery("listParagraphs", [props.articleId]).data;
  const addParagraphMutation = useApiMutation("addParagraph", {
    invalidates: ["listParagraphs", "listParagraphTags"],
  });
  return (
    <div style={{ border: "1px solid black", padding: 4 }}>
      {paragraphs.map((it) => (
        <ParagraphInput key={it.id} id={it.id} />
      ))}
      <button onClick={() => addParagraphMutation.mutate([props.articleId])}>
        New
      </button>
    </div>
  );
}

function ParagraphInput(props: { id: ParagraphId }) {
  const paragraph = useApiQuery("getParagraph", [props.id]).data;
  const updateMutation = useApiMutation("updateParagraph", {
    invalidates: ["getParagraph"],
  });
  const removeMutation = useApiMutation("removeParagraph");
  const [draft, setDraft] = useState(paragraph.draft);
  const [text, setText] = useState(paragraph.text);
  const paragraphTags = useApiQuery("listParagraphTags", [paragraph.id]).data;
  const removeTagMutation = useApiMutation("removeParagraphTag", {
    invalidates: ["listParagraphTags"],
  });
  const addTagMutation = useApiMutation("addParagraphTag", {
    invalidates: ["listParagraphTags"],
  });

  const save = () => {
    updateMutation.mutate([paragraph.id, text, draft]);
  };

  return (
    <div
      style={{ border: "1px solid black", padding: 8 }}
      onKeyDown={(e) => {
        if (e.key === "s" && e.ctrlKey) {
          save();
        }
      }}
    >
      <div>
        {paragraph.id}
        <BoolInput
          label="draft"
          v={draft}
          s={setDraft}
          containerStyle={{ display: "inline" }}
          labelStyle={{ minWidth: 0 }}
          inputStyle={{ width: 50 }}
        />
        <TagView
          v={paragraphTags}
          onRemove={(id) => {
            removeTagMutation.mutate([id]);
          }}
        />
        <TagSelector
          onAdd={(tagId) => {
            addTagMutation.mutate([paragraph.id, tagId]);
          }}
        />
        <SafeButton onClick={() => removeMutation.mutate([paragraph.id])}>
          Remove
        </SafeButton>
      </div>
      <I18nTextInput v={text} s={setText} textarea />
    </div>
  );
}

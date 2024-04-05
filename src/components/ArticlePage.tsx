import type { Article } from "p44-types";
import { useApiMutation, useApiQuery } from "../hooks/api";
import { I18nTextSummary } from "./common/I18nTextSummary";
import { useMemo } from "react";
import { sortByPriority } from "../utils/p44";
import { Link } from "react-router-dom";

export function ArticlePage() {
  const articlesQuery = useApiQuery("listArticles", []);
  const addMutation = useApiMutation("addArticle");
  const articles = useMemo(
    () => sortByPriority(articlesQuery.data),
    [articlesQuery.data],
  );
  return (
    <div>
      {articles.map((it) => (
        <ArticleSummary key={it.id} v={it} />
      ))}
      <button
        onClick={() => {
          addMutation.mutate([]);
        }}
      >
        New
      </button>
    </div>
  );
}

function ArticleSummary(props: { v: Article }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "100px 50px 100px 20px 200px",
      }}
    >
      <Link to={`/article/article/${props.v.id}`}>Detail</Link>
      <div>{props.v.id}</div>
      <div>{props.v.priority}</div>
      <div>{props.v.draft ? "D" : ""}</div>
      <I18nTextSummary v={props.v.title} />
    </div>
  );
}

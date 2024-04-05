import type { TagCategory } from "p44-types";
import { useApiMutation, useApiQuery } from "../hooks/api";
import { I18nTextSummary } from "./common/I18nTextSummary";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { sortByPriority } from "../utils/p44";

export function TagPage() {
  const tcQuery = useApiQuery("listTagCategories", []);
  const tagCategories = useMemo(
    () => sortByPriority(tcQuery.data),
    [tcQuery.data],
  );
  const addMutation = useApiMutation("addTagCategory");
  return (
    <div>
      {tagCategories.map((tc) => (
        <TagCategorySummary key={tc.id} v={tc} />
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

function TagCategorySummary(props: { v: TagCategory }) {
  const v = props.v;
  const tags = useApiQuery("listTags", [v.id]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "50px 50px 100px 300px 150px 600px",
        border: "1px solid grey",
      }}
    >
      <Link to={`/tag/category/${v.id}`}>Detail</Link>
      <div>{v.id}</div>
      <div>{v.priority}</div>
      <I18nTextSummary v={v.label} />
      <div>{v.target.join(",")}</div>
      <div>
        {tags.data.map((it) => (
          <div key={it.id} style={{ display: "inline" }}>
            <I18nTextSummary style={{ display: "inline" }} v={it.label} />
          </div>
        ))}
      </div>
    </div>
  );
}

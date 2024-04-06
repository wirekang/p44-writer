import type { TagCategory, TagId } from "p44-types";
import { useApiQuery } from "../hooks/api";
import { Suspense, useMemo, useState } from "react";
import { sortByPriority } from "../utils/p44";
import { createPortal } from "react-dom";
import { I18nTextSummary } from "./common/I18nTextSummary";

export type TaggedTag = {
  tagId: TagId;
};

type Props = {
  onAdd: (tagId: TagId) => unknown;
};

export function TagSelector(props: Props) {
  const [open, setOpen] = useState(false);

  if (!open) {
    return <button onClick={setOpen.bind(null, true)}>TAG</button>;
  }

  return (
    <Suspense>
      {createPortal(
        <Inner {...props} onClose={setOpen.bind(null, false)} />,
        document.body,
      )}
    </Suspense>
  );
}

function Inner(props: Props & { onClose: () => unknown }) {
  const query = useApiQuery("listTagCategories", []);
  const tagCategories = useMemo(() => sortByPriority(query.data), [query.data]);
  return (
    <div
      style={{
        position: "fixed",
        top: 200,
        left: 200,
        backgroundColor: "white",
        padding: 16,
        border: "1px solid black",
      }}
    >
      <button onClick={props.onClose}>Close</button>
      <div>
        {tagCategories.map((tc) => (
          <TagCategorySelector key={tc.id} v={tc} onSelect={props.onAdd} />
        ))}
      </div>
    </div>
  );
}

function TagCategorySelector(props: {
  v: TagCategory;
  onSelect: (tagId: TagId) => unknown;
}) {
  const query = useApiQuery("listTags", [props.v.id]);
  const tags = useMemo(() => sortByPriority(query.data), [query.data]);

  return (
    <div>
      {props.v.id}
      <I18nTextSummary v={props.v.label} style={{ display: "inline" }} />
      {tags.map((tag) => (
        <button
          key={tag.id}
          onClick={() => {
            props.onSelect(tag.id);
          }}
        >
          {tag.id}
          <I18nTextSummary v={tag.label} />
        </button>
      ))}
    </div>
  );
}

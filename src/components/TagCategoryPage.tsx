import { Link, useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../hooks/api";
import type { Tag } from "p44-types";
import { SafeButton } from "./common/SafeButton";
import { I18nTextSummary } from "./common/I18nTextSummary";
import { useMemo, useState } from "react";
import { sortByPriority } from "../utils/p44";
import { I18nTextInput } from "./common/I18nTextInput";
import { IntInput } from "./common/IntInput";

export function TagCategoryPage() {
  const tagCategoryId = parseInt(useParams()["id"]!);
  const tagsQuery = useApiQuery("listTags", [tagCategoryId]);
  const tags = useMemo(() => sortByPriority(tagsQuery.data), [tagsQuery.data]);
  const tagCategory = useApiQuery("getTagCategory", [tagCategoryId]).data;
  const removeMutation = useApiMutation("removeTagCategory");
  const [label, setLabel] = useState(tagCategory.label);
  const [description, setDescription] = useState(tagCategory.description);
  const [priority, setPriority] = useState(tagCategory.priority);
  const [target, setTarget] = useState(tagCategory.target);
  const updateMutation = useApiMutation("updateTagCategory");
  const addMutation = useApiMutation("addTag");
  return (
    <div>
      <I18nTextInput label="label" v={label} s={setLabel} />
      <I18nTextInput
        label="description"
        v={description}
        s={setDescription}
        inputStyle={{ width: 400 }}
      />
      <IntInput label="priority" v={priority} s={setPriority} />
      <div
        style={{
          border: "1px solid grey",
          padding: 4,
        }}
      >
        <span
          style={{
            display: "inline-block",
            width: 100,
          }}
        >
          target:
        </span>
        {target.join(", ")}
        <button
          onClick={() => {
            setTarget(["article"]);
          }}
        >
          article
        </button>
        <button
          onClick={() => {
            setTarget(["paragraph"]);
          }}
        >
          paragraph
        </button>
        <button
          onClick={() => {
            setTarget(["article", "paragraph"]);
          }}
        >
          all
        </button>
      </div>
      <button
        onClick={() => {
          updateMutation.mutate([
            tagCategoryId,
            label,
            description,
            target,
            priority,
          ]);
        }}
      >
        Update
      </button>
      <SafeButton
        onClick={() => {
          removeMutation.mutate([tagCategoryId]);
        }}
      >
        Remove
      </SafeButton>
      <h5>Tags</h5>
      {tags.map((it) => (
        <TagView key={it.id} v={it} />
      ))}
      <button
        onClick={() => {
          addMutation.mutate([tagCategoryId]);
        }}
      >
        New
      </button>
    </div>
  );
}

function TagView(props: { v: Tag }) {
  const v = props.v;
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "60px 50px 100px 200px 600px",
      }}
    >
      <Link to={`/tag/tag/${v.id}`}>Detail</Link>
      <div>{v.id}</div>
      <div>{v.priority}</div>
      <I18nTextSummary v={v.label} />
      <I18nTextSummary v={v.description} />
    </div>
  );
}

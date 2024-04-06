import type { Tag, TagId } from "p44-types";
import { useApiQuery } from "../hooks/api";
import { I18nTextSummary } from "./common/I18nTextSummary";

export function TagView(props: {
  v: { id: any; tagId: TagId }[];
  onRemove: (id: any) => unknown;
}) {
  return (
    <div style={{ border: "1px solid grey" }}>
      {props.v.map((v) => (
        <FuckingSlowTagView key={v.id} v={v} onRemove={props.onRemove} />
      ))}
    </div>
  );
}

function FuckingSlowTagView(props: {
  v: { id: any; tagId: TagId };
  onRemove: (id: any) => unknown;
}) {
  const tag = useApiQuery("getTag", [props.v.tagId]).data;
  const tagCategory = useApiQuery("getTagCategory", [tag.categoryId]).data;

  return (
    <div>
      <I18nTextSummary v={tagCategory.label} style={{ display: "inline" }} />:
      <I18nTextSummary v={tag.label} style={{ display: "inline" }} />
      <button onClick={props.onRemove.bind(null, props.v.id)}>Remove</button>
    </div>
  );
}

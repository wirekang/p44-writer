import type { Tag, TagCategory } from "p44-types";
import { useApiQuery } from "../hooks/api";

export function TagView() {
  const tags = useApiQuery("listTags", []).data ?? [];
  const tagCategories = useApiQuery("listTagCategories", []).data ?? [];

  const merged = tagCategories.map((tc) => {
    return { ...tc, tags: tags.filter((it) => it.categoryId === tc.id) };
  });

  return (
    <div>
      <div>Tags</div>
      {merged.map((it) => (
        <TagCategoryView key={it.id} v={it}></TagCategoryView>
      ))}
    </div>
  );
}

function TagCategoryView(props: { v: TagCategory & { tags: Tag[] } }) {
  const v = props.v;
  return <pre>{JSON.stringify(v, null, 2)}</pre>;
}

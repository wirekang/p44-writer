import { useParams } from "react-router-dom";
import { useApiMutation, useApiQuery } from "../hooks/api";
import { SafeButton } from "./common/SafeButton";
import { useState } from "react";
import { I18nTextInput } from "./common/I18nTextInput";
import { IntInput } from "./common/IntInput";

export function TagTagPage() {
  const tagId = parseInt(useParams()["id"]!, 10);
  const tag = useApiQuery("getTag", [tagId]).data;
  const updateMutation = useApiMutation("updateTag");
  const removeMutation = useApiMutation("removeTag");
  const [label, setLabel] = useState(tag.label);
  const [description, setDescription] = useState(tag.description);
  const [priority, setPriority] = useState(tag.priority);

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
      <button
        onClick={() => {
          updateMutation.mutate([tagId, label, description, priority]);
        }}
      >
        Update
      </button>
      <SafeButton
        onClick={() => {
          removeMutation.mutate([tagId]);
        }}
      >
        Remove
      </SafeButton>
    </div>
  );
}

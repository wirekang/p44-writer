import { useQueryP44Api } from "../hooks/useQueryP44Api";

export function App() {
  const api = useQueryP44Api();

  if (api.isError) {
    return <pre>{`${api.error.stack}`}</pre>;
  }

  if (!api.isSuccess) {
    return <div>Initializing...</div>;
  }
  return <div></div>;
}

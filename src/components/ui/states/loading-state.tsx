import { StateHandler } from "./state-handler";

export function LoadingState() {
  return (
    <StateHandler
      state="loading"
      skeletonVariant="table"
    />
  );
}
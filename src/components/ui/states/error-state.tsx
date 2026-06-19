import { StateHandler } from "./state-handler";

interface Props {
  error?: string;
  onRetry?: () => void;
}

export function ErrorState({
  error,
  onRetry,
}: Props) {
  return (
    <StateHandler
      state="error"
      error={error}
      onRetry={onRetry}
    />
  );
}

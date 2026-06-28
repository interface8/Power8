import { StateHandler } from "./state-handler";

interface Props {
  title?: string;
  message?: string;
}

export function EmptyState({
  title,
  message,
}: Props) {
  return (
    <StateHandler
      state="empty"
      title={title}
      message={message}
    />
  );
}
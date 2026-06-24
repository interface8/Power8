"use client";

import { StateHandler } from "./state-handler";
import { StateHandlerProps } from "./types";

type Props = Omit<StateHandlerProps, "state">;

export function NoResultsState(props: Props) {
  return (
    <StateHandler
      state="noResults"
      {...props}
    />
  );
}
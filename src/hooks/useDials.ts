import * as React from "react";
import { Dial } from "../types";
import { StorageType } from "../types/storageType";
import useStorageListener from "./useStorageListener";

interface State {
  dials: Dial[];
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: Dial[];
}

interface ErrorAction {
  type: "Error";
  payload: Error;
}

type Action = LoadAction | DoneAction | ErrorAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "Load":
      return { dials: state.dials, isLoading: true };
    case "Done":
      return { dials: action.payload, isLoading: false };
    case "Error":
      return { dials: [], isLoading: false, error: action.payload };
  }
};

const useDials = (groupId?: string) => {
  const [state, dispatch] = React.useReducer(reducer, {
    dials: [],
    isLoading: true,
  });

  const refetch = React.useCallback(() => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.get({ dials: [] });
    return promise
      .then((res) => {
        const filtered = groupId
          ? (res.dials as Dial[]).filter((dial) => dial.group === groupId)
          : (res.dials as Dial[]);

        dispatch({ type: "Done", payload: filtered });
      })
      .catch((err) => {
        dispatch({ type: "Error", payload: err as Error });
      });
  }, [groupId]);

  React.useEffect(() => {
    refetch();
  }, [groupId]);

  useStorageListener(
    StorageType.SYNC,
    (changed) => {
      if ("dials" in changed) {
        const newValue = changed.dials.newValue;
        const filtered = groupId
          ? (newValue as Dial[]).filter((dial) => dial.group === groupId)
          : (newValue as Dial[]);
        dispatch({ type: "Done", payload: filtered });
      }
    },
    [groupId]
  );

  return React.useMemo(() => ({ ...state, refetch }), [state, refetch]);
};

export default useDials;

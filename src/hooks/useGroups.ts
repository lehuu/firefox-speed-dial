import * as React from "react";
import { Group } from "../types";
import { StorageType } from "../types/storageType";
import useIsMounted from "./useIsMounted";
import useStorageListener from "./useStorageListener";

interface State {
  groups: Group[];
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: Group[];
}

interface ErrorAction {
  type: "Error";
  payload: Error;
}

type Action = LoadAction | DoneAction | ErrorAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "Load":
      return { groups: state.groups, isLoading: true };
    case "Done":
      return { groups: action.payload, isLoading: false };
    case "Error":
      return { groups: [], isLoading: false, error: action.payload };
  }
};

const useGroups = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    groups: [],
    isLoading: true,
  });
  const isMounted = useIsMounted();

  const refetch = React.useCallback(() => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.get({ groups: [] });
    return promise
      .then((res) => {
        if (!isMounted()) return;
        dispatch({ type: "Done", payload: (res.groups as Group[]) ?? [] });
      })
      .catch((err) => {
        if (!isMounted()) return;
        dispatch({ type: "Error", payload: err as Error });
      });
  }, []);

  React.useEffect(() => {
    refetch();
  }, []);

  useStorageListener(
    StorageType.SYNC,
    (changed) => {
      if ("groups" in changed) {
        dispatch({ type: "Done", payload: changed.groups.newValue ?? [] });
      }
    },
    []
  );

  return state;
};

export default useGroups;

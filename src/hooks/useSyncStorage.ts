import * as React from "react";
import { Dial, Group } from "../types";
import { StorageType } from "../types/storageType";
import useStorageListener from "./useStorageListener";

interface State {
  data: { groups: Group[]; dials: Dial[] };
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: { groups: Group[]; dials: Dial[] };
}

interface ErrorAction {
  type: "Error";
  payload: Error;
}

type Action = LoadAction | DoneAction | ErrorAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "Load":
      return { data: state.data, isLoading: true };
    case "Done":
      return { data: action.payload, isLoading: false };
    case "Error":
      return {
        data: { groups: [], dials: [] },
        isLoading: false,
        error: action.payload,
      };
  }
};

const useSyncStorage = () => {
  const [{ data, isLoading, error }, dispatch] = React.useReducer(reducer, {
    data: { groups: [], dials: [] },
    isLoading: true,
  });

  const refetch = () => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.get();
    return promise
      .then((res) => {
        dispatch({
          type: "Done",
          payload: res as { groups: Group[]; dials: Dial[] },
        });
      })
      .catch((err) => {
        dispatch({ type: "Error", payload: err as Error });
      });
  };

  React.useEffect(() => {
    refetch();
  }, []);

  useStorageListener(StorageType.SYNC, () => {
    refetch();
  });

  return { data, isLoading, error, refetch };
};

export default useSyncStorage;

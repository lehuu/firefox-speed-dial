import * as React from "react";
import { Dial, Group, StorageContent } from "../types";
import { StorageType } from "../types/storageType";
import useIsMounted from "./useIsMounted";
import useStorageListener from "./useStorageListener";

interface State {
  data: StorageContent;
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: StorageContent;
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
        data: {},
        isLoading: false,
        error: action.payload,
      };
  }
};

const useSyncStorage = () => {
  const [state, dispatch] = React.useReducer(reducer, {
    data: {},
    isLoading: true,
  });

  const isMounted = useIsMounted();

  const refetch = () => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.get();
    return promise
      .then((res) => {
        if (!isMounted()) return;
        dispatch({
          type: "Done",
          payload: res as StorageContent,
        });
      })
      .catch((err) => {
        if (!isMounted()) return;

        dispatch({ type: "Error", payload: err as Error });
      });
  };

  React.useEffect(() => {
    refetch();
  }, []);

  useStorageListener(StorageType.SYNC, () => {
    refetch();
  });

  return state;
};

export default useSyncStorage;

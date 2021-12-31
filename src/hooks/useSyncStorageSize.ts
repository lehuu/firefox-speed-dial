import * as React from "react";
import { Dial, Group } from "../types";
import { StorageType } from "../types/storageType";
import useIsMounted from "./useIsMounted";
import useStorageListener from "./useStorageListener";

interface State {
  data: { size: number };
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: { size: number };
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
        data: { size: 0 },
        isLoading: false,
        error: action.payload,
      };
  }
};

const useSyncStorageSize = (key?: string) => {
  const [state, dispatch] = React.useReducer(reducer, {
    data: { size: 0 },
    isLoading: true,
  });
  const isMounted = useIsMounted();

  const refetch = () => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.getBytesInUse(key);
    return promise
      .then((res) => {
        if (!isMounted()) return;
        dispatch({
          type: "Done",
          payload: { size: res },
        });
      })
      .catch((err) => {
        if (!isMounted()) return;
        dispatch({ type: "Error", payload: err as Error });
      });
  };

  React.useEffect(() => {
    refetch();
  }, [key]);

  useStorageListener(
    StorageType.SYNC,
    () => {
      refetch();
    },
    [key]
  );

  return state;
};

export default useSyncStorageSize;

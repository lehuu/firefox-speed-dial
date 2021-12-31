import * as React from "react";
import { Dial } from "../types";
import { StorageType } from "../types/storageType";
import useIsMounted from "./useIsMounted";
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

const useDials = (groupId: string) => {
  const [state, dispatch] = React.useReducer(reducer, {
    dials: [],
    isLoading: true,
  });
  const isMounted = useIsMounted();

  const refetch = React.useCallback(() => {
    dispatch({ type: "Load" });
    const promise = browser.storage.sync.get({ [`dials-${groupId}`]: [] });
    return promise
      .then((res) => {
        if (!isMounted()) return;
        dispatch({
          type: "Done",
          payload: (res[`dials-${groupId}`] as Dial[]) ?? [],
        });
      })
      .catch((err) => {
        if (!isMounted()) return;
        dispatch({ type: "Error", payload: err as Error });
      });
  }, [groupId]);

  React.useEffect(() => {
    refetch();
  }, [groupId]);

  useStorageListener(
    StorageType.SYNC,
    (changed) => {
      if (`dials-${groupId}` in changed) {
        const newValue = changed[`dials-${groupId}`].newValue;
        dispatch({ type: "Done", payload: (newValue as Dial[]) ?? [] });
      }
    },
    [groupId]
  );

  return state;
};

export default useDials;

import * as React from "react";

interface State {
  defaultTab: number;
  isLoading: boolean;
  error?: Error;
}

interface LoadAction {
  type: "Load";
}

interface DoneAction {
  type: "Done";
  payload: number;
}

interface ErrorAction {
  type: "Error";
  payload: Error;
}

type Action = LoadAction | DoneAction | ErrorAction;

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "Load":
      return { defaultTab: state.defaultTab, isLoading: true };
    case "Done":
      return { defaultTab: action.payload, isLoading: false };
    case "Error":
      return { defaultTab: 0, isLoading: false, error: action.payload };
  }
};

const useDefaultTab = () => {
  const [{ defaultTab, isLoading, error }, dispatch] = React.useReducer(
    reducer,
    {
      defaultTab: 0,
      isLoading: true
    }
  );

  const refetch = () => {
    dispatch({ type: "Load" });
    const promise = browser.storage.local.get({ defaultTab: 0 });
    return promise
      .then(res => {
        dispatch({ type: "Done", payload: res.defaultTab as number });
      })
      .catch(err => {
        dispatch({ type: "Error", payload: err as Error });
      });
  };

  React.useEffect(() => {
    refetch();
  }, []);

  return { defaultTab, isLoading, error, refetch };
};

export default useDefaultTab;

import * as React from "react";

interface Group {
  id: number;
  title: string;
  position: number;
}

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
  const [{ groups, isLoading, error }, dispatch] = React.useReducer(reducer, {
    groups: [],
    isLoading: true
  });

  React.useEffect(() => {
    const promise = browser.storage.sync.get({ groups: [] });
    promise
      .then(res => {
        dispatch({ type: "Done", payload: res.groups as Group[] });
      })
      .catch(err => {
        dispatch({ type: "Error", payload: err as Error });
      });
  }, []);

  return { groups, isLoading, error };
};

export default useGroups;

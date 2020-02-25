import * as React from "react";
import { v4 as uuid } from "uuid";
import { Group } from "./useGroups";

interface State {
  called: boolean;
  isLoading: boolean;
  error?: Error;
}

const useGroupMutation = () => {
  const [state, setState] = React.useState<State>({
    isLoading: false,
    called: false
  });

  const updateGroup = (group: Group) => {
    const promise = browser.storage.sync.get({ groups: [] });
    setState({ isLoading: true, called: true });
    return promise
      .then(res => {
        const groups = res.groups as Group[];
        const filteredGroup = groups.filter(el => el.id != group.id);
        filteredGroup.push(group);
        filteredGroup.sort((a, b) => a.position - b.position);
        return browser.storage.sync.set({ groups: filteredGroup });
      })
      .then(() => {
        setState({ isLoading: false, called: true });
      })
      .catch(err => setState({ isLoading: false, called: true, error: err }));
  };

  const createGroup = (title: string) => {
    const promise = browser.storage.sync.get({ groups: [] });
    setState({ isLoading: true, called: true });
    promise
      .then(res => {
        const groups = res.groups as Group[];
        const newGroup: Group = { id: uuid(), title, position: groups.length };
        groups.push(newGroup);
        return browser.storage.sync.set({ groups: groups });
      })
      .then(() => {
        setState({ isLoading: false, called: true });
      })
      .catch(err => setState({ isLoading: false, called: true, error: err }));
  };

  const deleteGroup = (group: Group) => {
    const promise = browser.storage.sync.get({ groups: [] });
    setState({ isLoading: true, called: true });
    return promise
      .then(res => {
        const groups = res.groups as Group[];
        const filteredGroup = groups.filter(el => el.id != group.id);
        filteredGroup.sort((a, b) => a.position - b.position);
        const result = filteredGroup.map((el, index) => ({
          ...el,
          position: index
        }));
        return browser.storage.sync.set({ groups: result });
      })
      .then(() => {
        setState({ isLoading: false, called: true });
      })
      .catch(err => setState({ isLoading: false, called: true, error: err }));
  };

  return { ...state, updateGroup, createGroup, deleteGroup };
};

export default useGroupMutation;

import { v4 as uuid } from "uuid";
import { Group, QueryResult } from "../types";

const createGroup = (title: string): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ groups: [] });
  return promise
    .then(res => {
      const groups = res.groups as Group[];
      const newGroup: Group = { id: uuid(), title, position: groups.length };
      groups.push(newGroup);
      return Promise.all([
        browser.storage.sync.set({ groups: groups }),
        newGroup
      ]);
    })
    .then(([, res]) => ({ data: res }))
    .catch(err => ({ error: err }));
};

export default createGroup;

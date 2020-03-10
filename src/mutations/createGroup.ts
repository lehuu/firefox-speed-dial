import { v4 as uuid } from "uuid";
import { Group, QueryResult } from "../types";

const createGroup = (title: string): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ groups: [] });
  return promise
    .then(res => {
      const groups = res.groups as Group[];
      const maxPosition =
        groups.length === 0
          ? -1
          : Math.max(...groups.map(dial => dial.position));

      const newGroup: Group = { id: uuid(), title, position: maxPosition + 1 };
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

import { Group, QueryResult } from "../types";

const updateGroupPositions = (
  groups: Group[]
): Promise<QueryResult<Group[]>> => {
  const promise = browser.storage.sync.set({ groups: groups });
  return promise
    .then(() => ({ data: groups }))
    .catch((err) => ({ error: err }));
};

export default updateGroupPositions;

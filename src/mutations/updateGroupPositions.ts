import { Group, QueryResult, SCHEMA_VERSION } from "../types";

const updateGroupPositions = (
  groups: Group[]
): Promise<QueryResult<Group[]>> => {
  const promise = browser.storage.sync.set({
    groups: groups,
    version: SCHEMA_VERSION,
  });
  return promise
    .then(() => ({ data: groups }))
    .catch((err) => ({ error: err }));
};

export default updateGroupPositions;

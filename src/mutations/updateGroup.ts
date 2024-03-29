import { Group, QueryResult, SCHEMA_VERSION } from "../types";

const updateGroup = (group: Group): Promise<QueryResult<Group>> => {
  const promise = browser.storage.sync.get({ groups: [] });
  return promise
    .then((res) => {
      const groups = res.groups as Group[];
      const filteredGroup = groups.filter((el) => el.id != group.id);
      filteredGroup.push(group);
      filteredGroup.sort((a, b) => a.position - b.position);
      return browser.storage.sync.set({
        groups: filteredGroup,
        version: SCHEMA_VERSION,
      });
    })
    .then(() => ({ data: group }))
    .catch((err) => ({ error: err }));
};

export default updateGroup;

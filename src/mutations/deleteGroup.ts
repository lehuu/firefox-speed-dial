import { Group, QueryResult, Dial, SCHEMA_VERSION } from "../types";

const deleteGroup = (group: Group): Promise<QueryResult<Group[]>> => {
  const promise = browser.storage.sync.remove(`dials-${group.id}`);
  return promise
    .then(() => browser.storage.sync.get({ groups: [] }))
    .then((res) => {
      const groups = res.groups as Group[];
      const filteredGroup = groups.filter((el) => el.id != group.id);
      filteredGroup.sort((a, b) => a.position - b.position);
      const result = filteredGroup.map((el, index) => ({
        ...el,
        position: index,
      }));
      return Promise.all([
        browser.storage.sync.set({ groups: result, version: SCHEMA_VERSION }),
        result,
      ]);
    })
    .then(([, res]) => {
      return { data: res, error: null };
    })
    .catch((err) => {
      return { data: null, error: err };
    });
};

export default deleteGroup;

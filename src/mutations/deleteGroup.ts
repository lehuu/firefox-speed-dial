import { Group, QueryResult, Dial } from "../types";

const deleteGroup = (group: Group): Promise<QueryResult<Group[]>> => {
  const promise = browser.storage.sync.get({ dials: [] });
  return promise
    .then((res) => {
      const filteredDials = (res.dials as Dial[]).filter(
        (dial) => dial.group !== group.id
      );
      return browser.storage.sync.set({ dials: filteredDials });
    })
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
        browser.storage.sync.set({ groups: result }),
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

import { Dial, QueryResult } from "../types";

const updateDialPositions = (dials: Dial[]): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ dials: [] });

  // const promise = browser.storage.sync.set({ dials: dials });
  const ids = dials.map(dial => dial.id);

  return promise
    .then(res => {
      const filteredDials = (res.dials as Dial[]).filter(
        dial => ids.indexOf(dial.id) > -1
      );
      filteredDials.push(...dials);
      return browser.storage.sync.set({ dials: filteredDials });
    })
    .then(() => ({ data: dials }))
    .catch(err => ({ error: err }));
};

export default updateDialPositions;

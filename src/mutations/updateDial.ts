import { Dial, QueryResult } from "../types";

const updateDial = (dial: Dial): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ dials: [] });
  return promise
    .then(res => {
      const dials = res.dials as Dial[];
      const filteredDial = dials.filter(el => el.id != dial.id);
      filteredDial.push(dial);
      return browser.storage.sync.set({ dials: filteredDial });
    })
    .then(() => ({ data: dial }))
    .catch(err => ({ error: err }));
};

export default updateDial;

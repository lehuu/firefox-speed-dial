import { Dial, QueryResult } from "../types";

const deleteDial = (dial: Dial): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ dials: [] });
  return promise
    .then(res => {
      const dials = res.dials as Dial[];
      const filteredDial = dials.filter(el => el.id != dial.id);
      filteredDial.sort((a, b) => a.position - b.position);
      const result = filteredDial.map((el, index) => ({
        ...el,
        position: index
      }));
      return Promise.all([browser.storage.sync.set({ dials: result }), result]);
    })
    .then(([, res]) => {
      return { data: res, error: null };
    })
    .catch(err => {
      return { data: null, error: err };
    });
};

export default deleteDial;

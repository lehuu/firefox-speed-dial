import { Dial, QueryResult, SCHEMA_VERSION } from "../types";

const deleteDial = (dial: Dial): Promise<QueryResult<Dial[]>> => {
  const promise = browser.storage.sync.get({ [`dials-${dial.group}`]: [] });
  return promise
    .then((res) => {
      const dials = res[`dials-${dial.group}`] as Dial[];
      const filteredDial = dials.filter((el) => el.id != dial.id);
      filteredDial.sort((a, b) => a.position - b.position);
      const result = filteredDial.map((el, index) => ({
        ...el,
        position: index,
      }));
      return Promise.all([
        browser.storage.sync.set({
          [`dials-${dial.group}`]: result,
          version: SCHEMA_VERSION,
        }),
        result,
      ]);
    })
    .then(([, res]) => {
      return { data: res };
    })
    .catch((err) => {
      return { error: err };
    });
};

export default deleteDial;

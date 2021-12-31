import { Dial, QueryResult, SCHEMA_VERSION } from "../types";

const updateDial = (dial: Dial): Promise<QueryResult<Dial>> => {
  const promise = browser.storage.sync.get({ [`dials-${dial.group}`]: [] });
  return promise
    .then((res) => {
      const dials = res[`dials-${dial.group}`] as Dial[];
      const filteredDial = dials.filter((el) => el.id != dial.id);
      filteredDial.push(dial);
      return browser.storage.sync.set({
        [`dials-${dial.group}`]: filteredDial,
        version: SCHEMA_VERSION,
      });
    })
    .then(() => ({ data: dial }))
    .catch((err) => ({ error: err }));
};

export default updateDial;

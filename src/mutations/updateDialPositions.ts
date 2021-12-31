import { Dial, QueryResult, SCHEMA_VERSION } from "../types";

const updateDialPositions = (dials: Dial[]): Promise<QueryResult<Dial[]>> => {
  if (dials.length === 0) {
    return Promise.resolve().then(() => ({ data: dials }));
  }

  const promise = browser.storage.sync.set({
    [`dials-${dials[0].group}`]: dials,
    version: SCHEMA_VERSION,
  });

  return promise.then(() => ({ data: dials })).catch((err) => ({ error: err }));
};

export default updateDialPositions;

import { v4 as uuid } from "uuid";
import { Dial, QueryResult, SCHEMA_VERSION } from "../types";

const createDial = (
  link: string,
  alias: string,
  color: string,
  group: string
): Promise<QueryResult<Dial>> => {
  const promise = browser.storage.sync.get({ [`dials-${group}`]: [] });
  return promise
    .then((res) => {
      const dials = (res[`dials-${group}`] as Dial[]) ?? [];
      const maxPosition =
        dials.length === 0
          ? -1
          : Math.max(...dials.map((dial) => dial.position));
      const newDial: Dial = {
        id: uuid(),
        link,
        alias,
        group,
        color,
        position: maxPosition + 1,
      };
      dials.push(newDial);
      return Promise.all([
        browser.storage.sync.set({
          [`dials-${group}`]: dials,
          version: SCHEMA_VERSION,
        }),
        newDial,
      ]);
    })
    .then(([, res]) => ({ data: res }))
    .catch((err) => ({ error: err }));
};

export default createDial;

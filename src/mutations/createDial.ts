import { v4 as uuid } from "uuid";
import { Dial, QueryResult } from "../types";

const createDial = (
  link: string,
  alias: string,
  color: string,
  group: string
): Promise<QueryResult> => {
  const promise = browser.storage.sync.get({ dials: [] });
  return promise
    .then(res => {
      const dials = res.dials as Dial[];
      const dialsInGroup = dials.filter(dial => dial.group === group);
      const maxPosition =
        dialsInGroup.length === 0
          ? -1
          : Math.max(...dialsInGroup.map(dial => dial.position));
      const newDial: Dial = {
        id: uuid(),
        link,
        alias,
        color,
        group,
        position: maxPosition + 1
      };
      dials.push(newDial);
      return Promise.all([browser.storage.sync.set({ dials: dials }), newDial]);
    })
    .then(([, res]) => ({ data: res }))
    .catch(err => ({ error: err }));
};

export default createDial;

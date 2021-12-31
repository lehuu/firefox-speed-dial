import { Group, QueryResult } from "../types";

const saveDefaultTab = (defaultTab: number): Promise<QueryResult<number>> => {
  const promise = browser.storage.local.set({ defaultTab });
  return promise
    .then(() => ({ data: defaultTab }))
    .catch((err) => ({ error: err }));
};

export default saveDefaultTab;

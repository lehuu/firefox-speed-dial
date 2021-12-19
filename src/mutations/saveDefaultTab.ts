import { QueryResult } from "../types";

const saveDefaultTab = (defaultTab: number): Promise<QueryResult> => {
  const promise = browser.storage.local.set({ defaultTab });
  return promise
    .then(() => ({ data: defaultTab }))
    .catch((err) => ({ error: err }));
};

export default saveDefaultTab;

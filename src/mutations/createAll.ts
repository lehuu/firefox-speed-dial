import { QueryResult } from "../types";
import { StorageContent } from "../types/storageContent";

const createAll = (
  content: StorageContent
): Promise<QueryResult<StorageContent>> => {
  return Promise.all([browser.storage.sync.set(content), content])
    .then(([, res]) => ({ data: res }))
    .catch((err) => ({ error: err }));
};

export default createAll;

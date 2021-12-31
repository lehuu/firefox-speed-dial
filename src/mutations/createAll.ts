import { QueryResult } from "../types";
import { StorageContent, SCHEMA_VERSION } from "../types";

const createAll = (
  content: StorageContent
): Promise<QueryResult<StorageContent>> => {
  return browser.storage.sync
    .clear()
    .then(() => {
      const contentCopy = { ...content };
      const contentKeys = Object.keys(content);
      contentKeys.forEach((key) => {
        if (key !== "groups" && !key.startsWith("dials-")) {
          delete contentCopy[key];
        }
      });

      return Promise.all([
        browser.storage.sync.set({ ...contentCopy, version: SCHEMA_VERSION }),
        contentCopy,
      ]);
    })
    .then(([, res]) => ({ data: res }))
    .catch((err) => ({ error: err }));
};

export default createAll;

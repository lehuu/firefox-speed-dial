import { Dial, SCHEMA_VERSION } from "../types";
import updateSyncStorage from "../utils/updateSyncStorage";

const updateExtensionCallback = async (
  details: browser.runtime._OnInstalledDetails
) => {
  if (details.reason === "update") {
    const syncStorage = await browser.storage.sync.get();

    const updatedSyncStorage = updateSyncStorage(syncStorage);
    if (updatedSyncStorage) {
      await browser.storage.sync.clear();
      await browser.storage.sync.set(updatedSyncStorage);
    }
  }
};

browser.runtime.onInstalled.addListener(updateExtensionCallback);

export {};

import React from "react";
import { StorageType } from "../types/storageType";

const useStorageListener = (
  storageType: StorageType,
  handler: (changes: { [key: string]: browser.storage.StorageChange }) => void,
  deps?: React.DependencyList
) => {
  React.useEffect(() => {
    const changeHandler: (
      changes: { [key: string]: browser.storage.StorageChange },
      areaName: string
    ) => void = (changes, areaName) => {
      if (areaName === storageType) {
        handler(changes);
      }
    };

    browser.storage.onChanged.addListener(changeHandler);

    return () => {
      browser.storage.onChanged.removeListener(changeHandler);
    };
  }, deps);
};

export default useStorageListener;

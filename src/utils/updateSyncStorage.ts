import { Dial, SCHEMA_VERSION } from "../types";

const updateSyncStorage = (currentStorage: { [key: string]: any }) => {
  const { version, groups, dials } = currentStorage;

  if (!version) {
    const dialsMapped: { [key: string]: Dial[] } = {};

    if (dials) {
      dials.forEach((dialElement: Dial) => {
        const dialGroupKey = `dials-${dialElement.group}`;

        if (dialGroupKey in dialsMapped) {
          dialsMapped[dialGroupKey].push(dialElement);
        } else {
          dialsMapped[dialGroupKey] = [dialElement];
        }
      });
    }

    const updatedSyncStorage = {
      version: SCHEMA_VERSION,
      groups,
      ...dialsMapped,
    };

    return updatedSyncStorage;
  }
  return null;
};

export default updateSyncStorage;

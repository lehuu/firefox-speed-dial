import * as t from "io-ts";
import { isRight } from "fp-ts/Either";
import { DialSchema, GroupSchema } from ".";

export const StorageContentSchema = t.type({
  dials: t.array(DialSchema),
  groups: t.array(GroupSchema),
});

export type StorageContent = t.TypeOf<typeof StorageContentSchema>;

export const isStorageContentSchema = (obj: unknown) => {
  return isRight(StorageContentSchema.decode(obj));
};

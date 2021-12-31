import * as t from "io-ts";
import { isRight } from "fp-ts/Either";
import { DialSchema, GroupSchema } from ".";

const StorageContentSchemaDial = t.record(t.string, t.array(DialSchema));

const StorageContentSchemaGroup = t.partial({
  groups: t.array(GroupSchema),
});

const StorageContentSchemaVersion = t.partial({
  version: t.number,
});

export const StorageContentSchema = t.intersection([
  StorageContentSchemaGroup,
  StorageContentSchemaDial,
  StorageContentSchemaVersion,
]);

export type StorageContent = t.TypeOf<typeof StorageContentSchema>;

export const isStorageContentSchema = (obj: any) => {
  const { groups, version, ...rest } = obj;
  const matchesGroupSchema = isRight(
    StorageContentSchemaGroup.decode({ groups })
  );
  const matchesVersionSchema = isRight(
    StorageContentSchemaVersion.decode({ version })
  );
  const matchesDialsSchema = isRight(StorageContentSchemaDial.decode(rest));

  return matchesGroupSchema && matchesVersionSchema && matchesDialsSchema;
};

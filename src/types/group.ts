import * as t from "io-ts";

export const GroupSchema = t.type({
  id: t.string,
  title: t.string,
  position: t.number,
});

export type Group = t.TypeOf<typeof GroupSchema>;

import * as t from "io-ts";

export const DialSchema = t.type({
  id: t.string,
  position: t.number,
  group: t.string,
  link: t.string,
  alias: t.string,
  color: t.string,
});

export type Dial = t.TypeOf<typeof DialSchema>;

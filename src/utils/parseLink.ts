import { get } from "psl";

const parseLink = (url: string) => {
  let name = "";
  try {
    name = get(url) ?? "";
  } finally {
    return name;
  }
};

export default parseLink;

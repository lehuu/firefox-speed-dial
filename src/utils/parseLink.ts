enum UrlType {
  Link,
  File,
}

const getLinkName = (url: string) => {
  let name = "";
  try {
    name = /:\/\/(?:www\.|)?(.*?)(?:\?|\/|$)/i.exec(url)[1].toLowerCase();
  } finally {
    return name;
  }
};

const getFileName = (url: string) => {
  let name = "";
  try {
    name = /:\/\/.*\/(.*?)$/i.exec(url)[1].toLowerCase();
  } finally {
    return name;
  }
};

const getType = (url: string) => {
  if (/^(http|ftp)/i.test(url)) {
    return UrlType.Link;
  } else {
    return UrlType.File;
  }
};

const parseLink = (url: string) => {
  const type = getType(url);
  return type === UrlType.Link ? getLinkName(url) : getFileName(url);
};

export default parseLink;

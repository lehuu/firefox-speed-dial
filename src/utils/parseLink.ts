enum UrlType {
  Link,
  File
}

const getLinkName = url => {
  let name = "";
  try {
    name = /:\/\/(?:www\.|)?(.*?)(?:\?|\/|$)/i.exec(url)[1].toLowerCase();
  } finally {
    return name;
  }
};

const getFileName = url => {
  let name = "";
  try {
    name = /:\/\/.*\/(.*?)$/i.exec(url)[1].toLowerCase();
  } finally {
    return name;
  }
};

const getType = url => {
  if (/^(http|ftp)/i.test(url)) {
    return UrlType.Link;
  } else {
    return UrlType.File;
  }
};

const parseLink = url => {
  const type = getType(url);
  return type === UrlType.Link ? getLinkName(url) : getFileName(url);
};

export default parseLink;

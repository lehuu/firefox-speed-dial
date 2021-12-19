import "./options.css";

function init() {
  const urlDiv = document.querySelector("#homepage-url");
  const homeURL = browser.runtime.getURL("index.html");
  urlDiv.innerHTML = `<a href="${homeURL}">${homeURL}</a>`;

  const versionDiv = document.querySelector("#version-id");
  const version = browser.runtime.getManifest().version;
  versionDiv.innerHTML = `<span>${version}</span>`;
}

document.onload = init();

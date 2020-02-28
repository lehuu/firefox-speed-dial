import "./options.css";

function init() {
  const urlDiv = document.querySelector("#homepage-url");
  const homeURL = browser.runtime.getURL("dist/index.html");
  urlDiv.innerHTML = `<a href="${homeURL}">${homeURL}</a>`;

  const versionDiv = document.querySelector("#version-id");
  const version = browser.runtime.getManifest().version;
  versionDiv.innerHTML = `<span>${version}</span>`;
}

document.onload = init();

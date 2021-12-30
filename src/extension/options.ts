import "./options.css";

function init() {
  const urlDiv = document.querySelector("#homepage-url");
  const homeURL = browser.runtime.getURL("index.html");
  if (urlDiv) {
    urlDiv.innerHTML = `<a href="${homeURL}">${homeURL}</a>`;
  }
  const versionDiv = document.querySelector("#version-id");
  const version = browser.runtime.getManifest().version;
  if (versionDiv) {
    versionDiv.innerHTML = `<span>${version}</span>`;
  }
}

window.onload = () => {
  init();
};

export {};

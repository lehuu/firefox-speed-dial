import "./options.css";

function init() {
  const urlDiv = document.querySelector("#homepage-url");
  const homeURL = browser.runtime.getURL("dist/index.html");
  urlDiv.innerHTML = `<a href="${homeURL}">${homeURL}</a>`;
}

document.onload = init();

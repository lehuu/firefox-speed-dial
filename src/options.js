import "./options.css";

function init() {
  let urlDiv = document.querySelector("#homepage-url");
  let homeURL = browser.runtime.getURL("dist/index.html");
  urlDiv.innerHTML = `<a href="${homeURL}">${homeURL}</a>`;
}

document.onload = init();

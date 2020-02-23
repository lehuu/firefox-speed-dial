
const homeURL = browser.runtime.getURL("dist/index.html");

function openPage() {
    browser.tabs.update({
      url: homeURL
    });
  }
  
browser.browserAction.onClicked.addListener(openPage);
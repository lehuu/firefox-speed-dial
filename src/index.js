import React from "react";
import { render } from "react-dom";

const App = () => {
  const groups = browser.storage.sync.get("groups");
  groups.then(res => {
    console.log(res);
  });

  return (
    <div>
      <button>+</button>
    </div>
  );
};

render(<App />, document.querySelector("#app"));

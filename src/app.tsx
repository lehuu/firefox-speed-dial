import * as React from "react";

const App: React.SFC<any> = () => {
  const groups = browser.storage.sync.get("groups");
  const dials = browser.storage.sync.get("dials");

  groups.then(res => {
    console.log(res);
  });

  return (
    <div>
      <button>+</button>
    </div>
  );
};

export default App;

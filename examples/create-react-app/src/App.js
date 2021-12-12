import "./App.css";
import { useEffect } from "react";
import di from "@mesur/dilithium";

import CrystVis from "crystvis-js";
import { exampleFiles } from "./examples";

function App() {
  useEffect(() => {
    (async () => {
      await di.init();
      const privateKeyJwk = await di.generate();
      const message = "hello";
      const signature = await di.sign(message, privateKeyJwk);
      const verified = await di.verify(message, signature, privateKeyJwk);
      console.log({ privateKeyJwk, message, signature, verified });
      setTimeout(() => {
        if (verified) {
          const visualizer = new CrystVis("#visualizer", 800, 600);
          visualizer.loadModels(exampleFiles["si8.xyz"], "xyz");
          visualizer.displayModel("xyz");
        }
      }, 1 * 1000);
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div id="visualizer"></div>
      </header>
    </div>
  );
}

export default App;

import logo from "./logo.svg";
import "./App.css";
import { useEffect } from "react";
import di from "@mesur/dilithium";

function App() {
  useEffect(() => {
    (async () => {
      await di.init();
      const privateKeyJwk = await di.generate();
      const message = "hello";
      const signature = await di.sign(message, privateKeyJwk);
      const verified = await di.verify(signature, message, privateKeyJwk);
      console.log({ privateKeyJwk, message, verified });
    })();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;

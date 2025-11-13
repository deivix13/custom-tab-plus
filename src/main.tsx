import ReactDOM from "react-dom/client";

import { App } from "./pages/newTab/App";

const rootElement = document.getElementById("side-panel-root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

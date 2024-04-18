import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <div className="bg-[#151518] text-[#A1A1AA] min-h-screen ">
      <App />
    </div>
  </React.StrictMode>
);

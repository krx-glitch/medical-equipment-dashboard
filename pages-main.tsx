import React from "react";
import { createRoot } from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";
import "./app/card-fix.css";
import "./app/company-panel.css";
import "./app/panel-reopen.css";
import "./app/product-detail.css";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>,
);

import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { theme } from "./theme";
import "@mantine/core/styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ColorSchemeScript defaultColorScheme="auto" storageKey="blog-app-theme" />
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MantineProvider>
  </React.StrictMode>
);

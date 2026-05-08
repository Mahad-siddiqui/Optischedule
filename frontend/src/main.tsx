import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { ThemeProvider } from "./hooks/useTheme";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "var(--bg-elevated)",
              color: "var(--text-primary)",
              border: "1px solid var(--border-subtle)",
              borderRadius: "12px",
              fontSize: "13px",
            },
            success: { iconTheme: { primary: "#34d399", secondary: "var(--bg-elevated)" } },
            error:   { iconTheme: { primary: "#fb7185", secondary: "var(--bg-elevated)" } },
          }}
        />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>
);

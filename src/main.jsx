import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { SnackbarProvider } from "notistack";
import NewConnection from "./NewConnection.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SnackbarProvider
      maxSnack={5}
      Components={{
        newConnection: NewConnection,
      }}
      autoHideDuration={5000}
    >
      <App />
    </SnackbarProvider>
  </StrictMode>
);

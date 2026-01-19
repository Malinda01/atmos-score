import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-1h6gvgpwk6620grd.us.auth0.com" // From App Settings
      clientId="0yU3X4B7daCLPqlcT9JWjho0ybuDlAnx" // From App Settings
      authorizationParams={{
        redirect_uri: "http://localhost:5173",
        audience: "https://atmos-api", // From API Settings
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);

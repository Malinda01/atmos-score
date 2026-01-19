import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain="dev-1h6gvgpwk6620grd.us.auth0.com" // Paste from Auth0
      clientId="JYsVhDPRNoHoBguvd8N2gl0SdKqBmRcQ" // Paste from Auth0
      authorizationParams={{
        redirect_uri: "http://localhost:5173",
        audience: "https://weather-api/", // Paste from Auth0 API
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>,
);

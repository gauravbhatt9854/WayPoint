import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { TopLayerProvider } from "../providers/TopLayerProvider.jsx";


createRoot(document.getElementById("root")).render(

<TopLayerProvider>
<Auth0Provider
  domain={import.meta.env.VITE_DOMAIN}
  clientId={import.meta.env.VITE_CLIENT}
  authorizationParams={{
    redirect_uri: window.location.origin,
  }}
  cacheLocation="localstorage"  // Use localStorage for persistent session
>
    <App />
</Auth0Provider>
</TopLayerProvider>
);

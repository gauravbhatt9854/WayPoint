import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./index.css";
import { Auth0Provider } from "@auth0/auth0-react";
import { SocketProvider } from "../providers/SocketProvider.jsx";
import Temp from "../components/Temp.jsx";


createRoot(document.getElementById("root")).render(

  <Auth0Provider
    domain={import.meta.env.VITE_DOMAIN}
    clientId={import.meta.env.VITE_CLIENT}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <SocketProvider>
      <App></App>
      {/* <Temp></Temp> */}
    </SocketProvider>
  </Auth0Provider>
);

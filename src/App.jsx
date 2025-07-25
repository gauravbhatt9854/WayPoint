import { lazy, Suspense, useState } from "react";
import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import { MapProvider } from "../providers/MapProvider";
import { SocketProvider } from "../providers/SocketProvider.jsx";

const Header = lazy(() => import("../components/Header"));
const Home = lazy(() => import("../components/Home"));
const LoginPage = lazy(() => import("../components/LoginPage"));

function App() {

  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <div className="h-screen w-screen overflow-hidden">
      <LoginPage />
    </div>
  }

  if (isAuthenticated) {
    return <div className="h-screen w-screen overflow-hidden">
      <SocketProvider>
        <MapProvider>
          <Header />
          <Home />
        </MapProvider>
      </SocketProvider>
    </div>
  }

}

export { App };
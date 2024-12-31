import "./App.css";
import Header from "../components/Header";
import { LoginPage } from "../components/LoginPage";
import Home from "../components/Home";
import { SocketProvider, SocketContext } from "../providers/SocketProvider";
import { useAuth0 } from "@auth0/auth0-react";
import { MapProvider } from "../providers/MapProvider";


function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <div className="h-screen w-screen overflow-hidden">
      {isAuthenticated ? (
        <MapProvider>
          <Header />
          <Home />
        </MapProvider>
      ) :
        (
          <LoginPage></LoginPage>
        )}
    </div>

  );
}

export { App };

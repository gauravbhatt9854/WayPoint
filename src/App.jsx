import "./App.css";
import Globe from "../components/Globe";
import Header from "../components/Header";
import { useState, createContext } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;
const socket = io(SERVER_URL);
const UserContext = createContext();

function App() {
  const { user, isAuthenticated  , loginWithRedirect} = useAuth0();
  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(false);

  return (
    <UserContext.Provider
      value={{
        clients,
        setClients,
        user,
        isAuthenticated,
        socket,
        isChat,
        setIsChat,
      }}
    >
      <div className="h-screen w-screen overflow-hidden">
      {isAuthenticated ? (
        <>
        <Header />
        <Globe />
        </>
      ) :
        (
          <div className="flex justify-end">
          <button
            onClick={() => loginWithRedirect()}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-all"
          >
            Log In
          </button>
        </div>
        )}
      </div>
    </UserContext.Provider>
  );
}

export { App, UserContext };

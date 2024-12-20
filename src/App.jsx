import "./App.css";
import Globe from "../components/Globe";
import Header from "../components/Header";
import { useState, createContext, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";
import { LoginPage } from "../components/LoginPage";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;
const socket = io(SERVER_URL);
const UserContext = createContext();

function App() {
  const { user, isAuthenticated  , loginWithRedirect} = useAuth0();
  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(true);
  const [isMap, setIsMap] = useState(true);
  const[server , setServer] = useState("");

  useEffect(()=>
  {
    socket.on("setCookie", (data) => {
      console.log("server updated");
      setServer(data.value)
    })
  },[socket])

  return (
    <UserContext.Provider
      value={{
        clients,
        setClients,
        user,
        socket,
        isChat,
        setIsChat,
        isMap, 
        setIsMap,
        server,
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
          <LoginPage></LoginPage>
        )}
      </div>
    </UserContext.Provider>
  );
}

export { App, UserContext };

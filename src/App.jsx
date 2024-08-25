import "./App.css";
import Globe from "../components/Globe";
import LoginButton from "../components/LogButton";
import { useState, createContext, useContext } from "react";
import Chat from "../components/Chat";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;
const socket = io(SERVER_URL);
const UserContext = createContext();

function App() {
  const { user, isAuthenticated } = useAuth0();
  const [clients, setClients] = useState([]);
  return (
    <UserContext.Provider
      value={{ clients, setClients, user, isAuthenticated, socket }}
    >
      <div className="h-screen w-screen overflow-scroll ">
        <LoginButton></LoginButton>
        <Globe></Globe>
        <Chat></Chat>
      </div>
    </UserContext.Provider>
  );
}
// export default App;
export { App, UserContext };

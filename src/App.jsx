import "./App.css";
import Globe from "../components/Globe";
import LoginButton from "../components/LogButton";
import { useState, createContext, useContext } from "react";
import Chat from "../components/Chat";

const UserContext = createContext();

function App() {
  const [clients, setClients] = useState([]);
  return (
    <UserContext.Provider value={{ clients, setClients }}>
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

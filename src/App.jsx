import "./App.css";
import Globe from "../components/Globe";
import LoginButton from "../components/LogButton";
import { useState, createContext, useContext } from "react";

const UserContext = createContext();

function App() {
  const [clients, setClients] = useState([]);
  return (
    <UserContext.Provider value={{ clients, setClients }}>
      <div className="h-screen w-screen overflow-hidden ">
        <LoginButton></LoginButton>
        <Globe></Globe>
      </div>
    </UserContext.Provider>
  );
}
// export default App;
export { App, UserContext };

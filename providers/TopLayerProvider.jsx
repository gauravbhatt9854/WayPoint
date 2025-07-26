import { createContext } from "react";
import socket from "./socketInstance"; // path may vary

const topLayerContext = createContext(null);

const TopLayerProvider = ({ children }) => {
  return (
    <topLayerContext.Provider value={socket}>
      {children}
    </topLayerContext.Provider>
  );
};

export { topLayerContext, TopLayerProvider };
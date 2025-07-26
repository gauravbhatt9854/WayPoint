import { createContext, useState } from "react";
import socket from "./socketInstance"; // path may vary

const topLayerContext = createContext(null);

const TopLayerProvider = ({ children }) => {
  const [mapCenter, setMapCenter] = useState([0, 0]);
  return (
    <topLayerContext.Provider value={{ socket, mapCenter, setMapCenter }}>
      {children}
    </topLayerContext.Provider>
  );
};

export { topLayerContext, TopLayerProvider };
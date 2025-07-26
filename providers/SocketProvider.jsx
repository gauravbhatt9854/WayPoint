import {
  useState,
  createContext,
  useEffect,
  useCallback,
  useContext,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { topLayerContext } from "./TopLayerProvider";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const {socket} = useContext(topLayerContext);

  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(true);
  const [isMap, setIsMap] = useState(true);
  const [server, setServer] = useState("server1");
  const [userLocation, setUserLocation] = useState([23, 79]);

  // Optional throttle (only send location if more than 4s since last)
  let lastSentAt = 0;

  const shareLocation = useCallback(() => {
    if (!navigator.geolocation || !socket) return;

    const now = Date.now();
    if (now - lastSentAt < 4000) return; // Throttle: skip if too soon

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        socket.emit("locationUpdate", { lat, lng });
        lastSentAt = now;

        setUserLocation((prev) => {
          if (prev[0] !== lat || prev[1] !== lng) {
            return [lat, lng];
          }
          return prev;
        });
      },
      (err) => {
        console.error("Geolocation error:", err);
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );
  }, [socket]);

  useEffect(() => {
    if (!isAuthenticated || !user || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", {
      username: user.name || "Anonymous",
      profileUrl: user.picture || "",
      lat: 0,
      lng: 0,
    });

    const handleAllLocations = (data) => {
      setClients(data);
      // ❌ Do NOT send location again here to reduce load
    };

    socket.on("allLocations", handleAllLocations);

    const interval = setInterval(() => {
      if (user) shareLocation();
    }, 100000);

    return () => {
      socket.off("allLocations", handleAllLocations);
      socket.disconnect();
      clearInterval(interval);
    };
  }, [user, isAuthenticated, socket, shareLocation]);

  return (
    <SocketContext.Provider
      value={{
        clients,
        setClients,
        user,
        isChat,
        setIsChat,
        isMap,
        setIsMap,
        server,
        isAuthenticated,
        loginWithRedirect,
        userLocation,
        setUserLocation,
        shareLocation,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
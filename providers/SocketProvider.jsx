import React, {
  useState,
  createContext,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(true);
  const [isMap, setIsMap] = useState(true);
  const [server, setServer] = useState("server1");
  const [userLocation, setUserLocation] = useState([23, 79]);

  const socket = useMemo(() => {
    const s = io(SERVER_URL, {
      autoConnect: false,
      transports: ["websocket"], // force WebSocket (avoid polling)
    });
    return s;
  }, [SERVER_URL]);

  // Share location only when user allows via button click or similar
  const shareLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        socket.emit("locationUpdate", { lat, lng });

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
    if (!isAuthenticated || !user) return;

    // Connect once only
    if (!socket.connected) {
      socket.connect();
    }

    // Register user once
    socket.emit("register", {
      username: user.name || "Anonymous",
      profileUrl: user.picture || "",
      lat: 0,
      lng: 0,
    });

    const handleAllLocations = (data) => {
      setClients(data);
    };

    socket.on("allLocations", handleAllLocations);

    const interval = setInterval(() => {
      if (user) shareLocation();
    }, 5000);

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
        socket,
        isChat,
        setIsChat,
        isMap,
        setIsMap,
        server,
        isAuthenticated,
        loginWithRedirect,
        userLocation,
        setUserLocation,
        shareLocation, // expose for user-triggered location sharing
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
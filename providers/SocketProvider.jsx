import React, {
  useState,
  createContext,
  useEffect,
  useMemo,
  useRef,
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
  const [isRegistered, setIsRegistered] = useState(false);

  const socket = useMemo(() => {
    return io(SERVER_URL, {
      autoConnect: false,
      transports: ["websocket"],
    });
  }, [SERVER_URL]);

  const locationIntervalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    socket.connect();

    // STEP 1: Get current location and emit 'register'
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setUserLocation([latitude, longitude]);

        socket.emit("register", {
          username: user.name || "Anonymous",
          profileUrl: user.picture || "",
          lat: latitude,
          lng: longitude,
        });
      });
    }

    // STEP 2: Wait for server acknowledgment
    socket.on("registered", () => {
      setIsRegistered(true);
    });

    // STEP 3: Listen for all client locations
    socket.on("allLocations", (data) => {
      setClients(data);
    });

    // STEP 4: Periodically update location, only if registered
    locationIntervalRef.current = setInterval(() => {
      if (isRegistered && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          socket.emit("locationUpdate", {
            lat: latitude,
            lng: longitude,
          });

          if (
            userLocation[0] !== latitude ||
            userLocation[1] !== longitude
          ) {
            setUserLocation([latitude, longitude]);
          }
        });
      }
    }, 5000);

    // Cleanup on unmount
    return () => {
      clearInterval(locationIntervalRef.current);
      socket.off("allLocations");
      socket.off("registered");
      socket.disconnect();
      setIsRegistered(false);
    };
  }, [user, isAuthenticated]);

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
        isRegistered,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
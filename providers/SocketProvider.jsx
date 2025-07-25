import React, {
  useState,
  createContext,
  useEffect,
  useMemo,
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
    return io(SERVER_URL, {
      autoConnect: false,
    });
  }, [SERVER_URL]);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;

    if (!socket.connected) {
      socket.connect();
    }

    // 🧭 First fetch location, then emit 'register'
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (!isMounted) return;

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

    // Listen for all clients' locations
    socket.on("allLocations", (data) => {
      if (isMounted) {
        setClients(data);
      }
    });

    // Periodically send location update
    function shareLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (!isMounted) return;

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
    }

    const interval = setInterval(() => {
      if (user) {
        shareLocation();
      }
    }, 5000);

    return () => {
      isMounted = false;
      socket.off("allLocations");
      socket.disconnect();
      clearInterval(interval);
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
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
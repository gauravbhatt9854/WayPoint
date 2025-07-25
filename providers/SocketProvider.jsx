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
  const [locationFetched, setLocationFetched] = useState(false);

  const socket = useMemo(() => {
    return io(SERVER_URL, {
      autoConnect: false,
    });
  }, [SERVER_URL]);

  // Initial connection and listener setup
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let isMounted = true;

    if (!socket.connected) {
      socket.connect();
    }

    // Listen for all clients' locations
    socket.on("allLocations", (data) => {
      if (isMounted) {
        setClients(data);
      }
    });

    const interval = setInterval(() => {
      if (user && locationFetched) {
        shareLocation();
      }
    }, 5000);

    return () => {
      isMounted = false;
      socket.off("allLocations");
      socket.disconnect();
      clearInterval(interval);
    };
  }, [user, isAuthenticated, locationFetched]);

  // 🔘 Called only on button click
  const requestLocation = () => {
    if (!navigator.geolocation || !user) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setUserLocation([lat, lng]);
      setLocationFetched(true); // ✅ Mark that location was fetched

      socket.emit("register", {
        username: user.name || "Anonymous",
        profileUrl: user.picture || "",
        lat,
        lng,
      });
    });
  };

  const shareLocation = () => {
    if (!navigator.geolocation || !user) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      socket.emit("locationUpdate", { lat, lng });

      if (userLocation[0] !== lat || userLocation[1] !== lng) {
        setUserLocation([lat, lng]);
      }
    });
  };

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
        requestLocation,
        locationFetched,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
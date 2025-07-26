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
  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const { socket, setMapCenter } = useContext(topLayerContext);

  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(true);
  const [isMap, setIsMap] = useState(true);
  const [server, setServer] = useState("server1");
  const [userLocation, setUserLocation] = useState([23, 79]);

  // Shared timestamp for throttling location updates

  const shareLocation = useCallback(() => {
    if (!navigator.geolocation || !socket) return;

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

        setMapCenter((prev) => {
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
  }, [socket, setMapCenter]);

  useEffect(() => {
    if (!isAuthenticated || !user || !socket) return;

    if (!socket.connected) {
      socket.connect();
    }

    // Register user with initial location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        setUserLocation([lat, lng]);
        setMapCenter([lat, lng]);

        socket.emit("register", {
          username: user.name || "Anonymous",
          profileUrl: user.picture || "",
          lat,
          lng,
        });
      },
      (err) => {
        console.error("Geolocation error (register):", err);

        // fallback: register with default coords
        socket.emit("register", {
          username: user.name || "Anonymous",
          profileUrl: user.picture || "",
          lat: 0,
          lng: 0,
        });
      },
      { enableHighAccuracy: true, timeout: 5000 }
    );

    // Delay fetching full client list
    const fetchClients = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/clients`);
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Error fetching client list:", err);
      }
    };

    setTimeout(fetchClients, 1000);

    // Receive updates from all clients
    const handleAllLocations = (data) => {
      setClients(data); // Just update, don’t echo own location again
    };

    socket.on("allLocations", handleAllLocations);

    // Location update every 60 seconds
    const interval = setInterval(() => {
      if (user) shareLocation();
    }, 60 * 1000);

    return () => {
      socket.off("allLocations", handleAllLocations);
      socket.disconnect(); // optional: can skip this if you want socket to persist across routes
      clearInterval(interval);
    };
  }, [user, isAuthenticated, socket, shareLocation, setMapCenter]);

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
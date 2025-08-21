import { useState, createContext, useEffect, useContext } from "react";
import socket from "./socketInstance";
import { UserContext } from "./UserProvider";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const { user } = useContext(UserContext);
  const [clients, setClients] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([0, 0]);
  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

  // ---------------- Live location updates ----------------
  useEffect(() => {
    let watchId;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setCurrentLocation([latitude, longitude]);
        },
        (err) => console.error("Geolocation error:", err),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
      );
    }
    return () => watchId && navigator.geolocation.clearWatch(watchId);
  }, []);

  // ---------------- Socket setup ----------------
  useEffect(() => {
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const registerUser = () => {
      if (!user) return;
      socket.emit("register", {
        username: user.name || "Anonymous",
        profileUrl: user.picture || "",
        lat: currentLocation[0],
        lng: currentLocation[1],
      });
    };

    const handleAllLocations = (data) => {
      setClients(data);
    };

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      registerUser();
    });

    socket.on("disconnect", (reason) => {
      console.warn("Socket disconnected:", reason);
    });

    // socket.on("allLocations", handleAllLocations);

    // Optional: fetch initial client list
    const fetchClients = async () => {
      try {
        const res = await fetch(`${SERVER_URL}/clients`);
        const data = await res.json();
        setClients(data);
      } catch (err) {
        console.error("Error fetching clients:", err);
      }
    };

    setTimeout(fetchClients, 5000);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("allLocations", handleAllLocations);
    };
  }, [user, SERVER_URL]);

  // ---------------- Emit location every 10 seconds ----------------
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(() => {
      if (socket.connected) {
        socket.emit("locationUpdate", {
          lat: currentLocation[0],
          lng: currentLocation[1],
        });
        console.log("Location sent:", currentLocation);
      }
    }, 10000); // every 10 seconds

    return () => clearInterval(interval);
  }, [currentLocation, user]);

  return (
    <SocketContext.Provider value={{ clients, currentLocation }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
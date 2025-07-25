import React, { useState, createContext, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";

const SocketContext = createContext(null);

const SocketProvider = (props) => {

  const { user, isAuthenticated, loginWithRedirect, isLoading } = useAuth0();
  if (!isAuthenticated) return null;

  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

  const [clients, setClients] = useState([]);
  const [isChat, setIsChat] = useState(true);
  const [isMap, setIsMap] = useState(true);
  const [server, setServer] = useState("");
  const [userLocation, setUserLocation] = useState([23, 79]);

  const socket = useMemo(() => {
    return io(SERVER_URL, {
      autoConnect: false,
    });
  }, [SERVER_URL]);

useEffect(() => {
  if (!isAuthenticated || !user) return;

  socket.connect();

  socket.on("setCookie", (data) => {
    const { name, value, options } = data;
    setServer(value);

    let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    if (options?.maxAge) {
      const expires = new Date(Date.now() + options.maxAge).toUTCString();
      cookieString += `; expires=${expires}`;
    }
    if (options?.path) {
      cookieString += `; path=${options.path}`;
    }

    document.cookie = cookieString;
  });

  // 🧭 First fetch location, then emit 'register'
  if (navigator.geolocation && user) {
    navigator.geolocation.getCurrentPosition((position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      setUserLocation([latitude, longitude]);

      socket.emit("register", {
        username: user.name || "Anonymous",
        profileUrl: user.picture || "fallback-image-url",
        lat: latitude,
        lng: longitude,
      });
    });
  }

  socket.on("allLocations", (data) => {
    setClients(data);
  });

  function shareLocation() {
    if (navigator.geolocation && user) {
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        socket.emit("locationUpdate", {
          lat: latitude,
          lng: longitude,
        });

        if (userLocation[0] !== latitude || userLocation[1] !== longitude) {
          setUserLocation([latitude, longitude]);
        }
      });
    }
  }

  const interval = setInterval(() => {
    if (user) shareLocation();
  }, 5000);

  return () => {
    socket.off("setCookie");
    socket.off("allUsers");
    socket.disconnect();
    clearInterval(interval);
  };
}, [user, isAuthenticated, socket]);


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
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
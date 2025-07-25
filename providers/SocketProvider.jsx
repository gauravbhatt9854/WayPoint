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
      setServer(value); // 💡 This updates UI state

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

    socket.emit("register", {
      l1: 101, // Replace with dynamic values if needed
      l2: 102,
      username: user.name || "Anonymous",
      profileUrl: user.picture || "fallback-image-url",
    });

    socket.on("allUsers", (data) => {
      setClients(data);
    });

    return () => {
      socket.off("setCookie");
      socket.off("allUsers");
      socket.disconnect();
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
      }}
    >
      {props.children}
    </SocketContext.Provider>
  );
};

export { SocketProvider, SocketContext };
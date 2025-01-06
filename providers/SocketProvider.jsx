import { React, useState, createContext, useEffect, useMemo } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import io from "socket.io-client";

const SocketContext = createContext();

const SocketProvider = (props) => {
    const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER;

    // Use useMemo to memoize the socket instance
    const socket = useMemo(() => io(SERVER_URL), [SERVER_URL]);

    const { user, isAuthenticated, loginWithRedirect } = useAuth0();
    const [clients, setClients] = useState([]);
    const [isChat, setIsChat] = useState(true);
    const [isMap, setIsMap] = useState(true);
    const [server, setServer] = useState("");

    useEffect(() => {

        socket.on("setCookie", (data) => {
            console.log("server updated");
            setServer(data.value);
        });

        socket.emit("register", {
            l1: 23,
            l2: 79,
            username: user?.name || "name not found",
            profileUrl: user?.picture || "fallback-image-url",
          });

          socket.on("allUsers", (data) => {
            setClients(data);
          });

        // Cleanup on unmount
        return () => {
            socket.off("setCookie");
            socket.off("allUsers");
        };
    }, [user , socket]);

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
                loginWithRedirect
            }}>
            {props.children}
        </SocketContext.Provider>
    );
};

export { SocketProvider, SocketContext };

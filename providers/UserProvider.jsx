import { createContext, useState, useEffect } from "react";
import socket from "./socketInstance";

const UserContext = createContext(null);

const UserProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        fetch(import.meta.env.VITE_SOCKET_SERVER + "/auth/me", {
            credentials: "include",
        })
            .then(res => {
                if (!res.ok) throw new Error();
                return res.json();
            })
            .then(data => {
                setUser(data.user);
                setIsAuthenticated(true);
                if (!socket.connected) {
                    socket.connect();
                }
            })
            .catch(() => setUser(null));
    }, []);

    const handleLogout = async () => {
        await fetch(import.meta.env.VITE_SOCKET_SERVER + "/auth/logout", {
            method: "POST",
            credentials: "include",
        });

        setUser(null);
    };

    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, isLoading, setIsLoading, handleLogout }}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };
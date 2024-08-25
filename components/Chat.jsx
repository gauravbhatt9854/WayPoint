import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useAuth0 } from "@auth0/auth0-react";

const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER2;

const socket = io(SERVER_URL);

const Chat = () => {
  const { user, isAuthenticated } = useAuth0();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loc_share = () => {
      if (navigator.geolocation && user) {
        // Ensure `user` is defined
        navigator.geolocation.getCurrentPosition((position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          console.log(latitude, " <<--->> ", longitude);
          socket.emit("loc-res", {
            l1: latitude,
            l2: longitude,
            username: user?.name || "name not found",
            profileUrl: user.picture || "fallback-image-url", // Send the profile URL
          });

          setUserLocation([latitude, longitude]);
        });
      } else {
        console.error(
          "Geolocation is not supported by this browser or user data is not ready."
        );
      }
    };
    // Listen for incoming messages
    setTimeout(() => {
      loc_share();
    }, 5000);
    socket.on("newChatMessage", (data) => {
      console.log("getting");
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("newChatMessage");
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Send message to server
      socket.emit("chatMessage", message);

      // Optionally display your own message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: "You",
          message: message,
          profileUrl: "",
          timestamp: new Date(),
        },
      ]);

      // Clear the input
      setMessage("");
    }
  };

  const loc_share = () => {
    if (navigator.geolocation && user) {
      // Ensure `user` is defined
      navigator.geolocation.getCurrentPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        console.log(latitude, " <<--->> ", longitude);
        socket.emit("loc-res", {
          l1: latitude,
          l2: longitude,
          username: user.name || "name not found",
          profileUrl: user.picture || "fallback-image-url", // Send the profile URL
        });

        setUserLocation([latitude, longitude]);
      });
    } else {
      console.error(
        "Geolocation is not supported by this browser or user data is not ready."
      );
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 bor border-rose-600 border-4 overflow-scroll">
      <div className="w-full max-w-lg p-4 bg-white shadow-lg rounded-lg flex flex-col">
        <div className="flex-1 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-4 ${
                msg.username === "You" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.username !== "You" && (
                <img
                  src={msg.profileUrl || "https://via.placeholder.com/40"}
                  alt={msg.username}
                  className="w-10 h-10 rounded-full mr-3"
                />
              )}
              <div>
                <div
                  className={`p-3 rounded-lg ${
                    msg.username === "You"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  <p className="text-sm">{msg.message}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {msg.username} •{" "}
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={sendMessage} className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

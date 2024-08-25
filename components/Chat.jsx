import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../src/App";

const Chat = () => {
  const { user, socket, isAuthenticated } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("newChatMessage", (data) => {
      console.log("getting");
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("newChatMessage");
    };
  }, [socket]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      socket.emit("chatMessage", message);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          username: "You",
          message: message,
          profileUrl: "",
          timestamp: new Date(),
        },
      ]);
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100 bor border-rose-600 border-4 overflow-scroll">
      {isAuthenticated ? (
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
      ) : (
        <div>
          <h1>login first</h1>
        </div>
      )}
    </div>
  );
};

export default Chat;

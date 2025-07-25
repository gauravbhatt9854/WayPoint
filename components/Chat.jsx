import { useState, useEffect, useContext, useRef } from "react";
import { SocketContext } from "../providers/SocketProvider";

const Chat = () => {
  const { user, socket, isChat } = useContext(SocketContext);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {

    const handleNewChatMessage = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    if (socket) {

      socket.on("newChatMessage", handleNewChatMessage);

      // Cleanup to avoid multiple listeners
      return () => {
        socket.off("newChatMessage", handleNewChatMessage);
      };
    } else {
      console.warn("Socket not connected. Waiting for reconnection...");
    }
  }, [messages, socket , user]);

  // Scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Emit message to server
  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() && socket) {
      socket.emit("chatMessage", message);

      // Add sent message to local state
      setMessages((prev) => [
        ...prev,
        {
          username: "You",
          message: message,
          profileUrl: user?.picture || "",
          timestamp: new Date(),
        },
      ]);
      setMessage("");  // Clear input after sending
    }
  };

  return (
    // <div className={`h-[50%] w-[85%] lg:h-[85%] lg:w-[50%] bg-white shadow-lg rounded-lg border border-gray-300 ${isChat ? 'block' : 'hidden'}`}>
    <div className={`h-[50%] w-[85%] lg:h-[85%] lg:w-[50%] bg-white shadow-lg rounded-lg border border-gray-300`}>
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div className={`${messages.length === 0 ? 'block' : 'hidden'} text-center text-gray-500 font-bold`}>
            START A CONVERSATION
          </div>
          
          {/* Messages List */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start mb-2 ${msg.username === "You" ? "justify-end" : "justify-start"}`}
            >
              {msg.username !== "You" && (
                <img
                  src={msg.profileUrl || "https://via.placeholder.com/40"}
                  alt={msg.username}
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div>
                <div
                  className={`p-2 rounded-lg max-w-xs break-words ${msg.username === "You" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}
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
          <div ref={messagesEndRef}></div>
        </div>

        {/* Message Input Form */}
        <form onSubmit={sendMessage} className="flex p-2 border-t border-gray-300">
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

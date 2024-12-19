import { useAuth0 } from "@auth0/auth0-react";
import { React, useContext } from "react";
import Client1 from "./Client1";
import { UserContext } from "../src/App";

const Header = () => {
  const { setIsChat, isChat } = useContext(UserContext);
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  return (
    <div className="h-[25] w-full lg:h-[15%] bg-gray-800 text-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          {/* Left part */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-400">
              <img src={user.picture} alt="profile" />
            </div>
            <h1 className="lg:text-lg font-semibold">{user?.name}</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md transition-all text-sm"
            >
              Log Out
            </button>
          </div>
          {/* Right part */}
          <Client1 />
          <button
            onClick={() => setIsChat((prev) => !prev)} // Correct usage with prev
            className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition-all text-sm"
          >
            {isChat ? "Hide Chat" : "Show Chat"}
          </button>
        </div>
    </div>
  );
};

export default Header;

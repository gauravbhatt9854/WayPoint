import { useAuth0 } from "@auth0/auth0-react";
import { React, useContext } from "react";
import Client1 from "./Client1";
import { UserContext } from "../src/App";

const Header = () => {
  const { isChat, setIsChat, isMap, setIsMap } = useContext(UserContext);
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  return (
    <div className="h-[15%] w-full bg-gray-800 text-white p-4 shadow-lg mb-5 lg:mb-0 flex justify-between items-center ">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-green-400">
          <img src={user.picture} alt="profile" />
        </div>
        <h1 className="lg:text-lg font-semibold">{user?.name}</h1>
      </div>
      <Client1 />
      <div className="btns flex gap-4">
        <button
          onClick={() => setIsChat((prev) => !prev)} // Correct usage with prev
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition-all text-sm"
        >
          {isChat ? "Hide Chat" : "Show Chat"}
        </button>
{/* 
        <button
          onClick={() => setIsMap((prev) => !prev)} // Correct usage with prev
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md transition-all text-sm"
        >
          {isMap ? "Hide Map" : "Show Map"}
        </button> */}

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md transition-all text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Header;

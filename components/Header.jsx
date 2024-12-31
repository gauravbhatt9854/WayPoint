import { useAuth0 } from "@auth0/auth0-react";
import { React, useContext, useState } from "react";
import Client1 from "./Client1";
import { SocketContext } from "../providers/SocketProvider";
import { MapContext, MapProvider } from "../providers/MapProvider";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { list, currMap, setCurrMap } = useContext(MapContext);
  const { isChat, setIsChat, isMap, setIsMap, server } = useContext(SocketContext);
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  return (
    <div className="lg:h-[15%] w-full h-[10%] bg-gray-800 text-white p-4 shadow-lg lg:mb-0 flex justify-between items-center relative z-10">

      <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
        <div className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full overflow-hidden border-2 border-green-400">
          <img src={user?.picture || `https://th.bing.com/th?id=OIP.F1A9PEX1YxAWvr9M1G1TWwHaHa&w=250&h=250&c=8&rs=1&qlt=90&o=6&dpr=1.3&pid=3.1&rm=2`} alt="profile" />
        </div>
        <h1 className="text-xs sm:text-sm md:text-lg font-semibold">{user?.name}</h1>
      </div>

      <Client1 />


      {/* <div className="btns flex gap-4">

        <input
          type="range"
          min="0"
          max={list.length - 1}
          onChange={(e) => setCurrMap(e.target.value)} // Correct usage with event
          className="bg-pink-600"
        // style={{ width: '100%' }}
        />

        <button
          className={`${currMap % 2 == 0 ? "bg-green-700" : "bg-yellow-700"
            } text-white py-1 px-3 lg:py-2 lg:px-4 rounded-md transition-all text-sm lg:text-base `}
          onClick={() => setCurrMap((currMap + 1) % list.length)}
        >
          {`TYPE : ${list[currMap].type} : ${currMap}`}

        </button>
        <button
          onClick={() => setIsChat((prev) => !prev)} // Correct usage with prev
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 lg:py-2 lg:px-4 rounded-md transition-all text-sm lg:text-base"
        >
          {isChat ? "Hide Chat" : "Show Chat"}
        </button>

        <button
          onClick={() => setIsMap((prev) => !prev)} // Correct usage with prev
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 lg:py-2 lg:px-4 rounded-md transition-all text-sm lg:text-base"
        >
          {isMap ? "Hide Map" : "Show Map"}
        </button>

        <button
          className={`${server.length > 0 ? "bg-green-700" : "bg-yellow-700"
            } text-white py-1 px-3 lg:py-2 lg:px-4 rounded-md transition-all text-sm lg:text-base disabled`}
        >
          {server.length === 0 ? "NO SERVER CONNECTED" : server}
        </button>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 lg:py-2 lg:px-4 rounded-md transition-all text-sm lg:text-base"
        >
          Log Out
        </button>
      </div> */}


      {/* <div className="w-[20%] lg:w-[10%] relative">
        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base]"
        >
          Open Dropdown
        </button>

        {isDropdownOpen && (
          <div className="absolute bg-black text-white mt-2 p-3 sm:p-4 rounded-md shadow-lg w-full">

            <div className="mb-3 sm:mb-4">
              <label htmlFor="range" className="block text-xs sm:text-sm mb-2">
                Select Range:
              </label>
              <input
                id="range"
                type="range"
                min="0"
                max={list.length - 1}
                value={currMap}
                onChange={(e) => setCurrMap(Number(e.target.value))}
                className="bg-pink-600 w-full"
              />
            </div>
            <button
              onClick={() => setCurrMap((currMap + 1) % list.length)}
              className={`${currMap % 2 === 0 ? "bg-green-700" : "bg-yellow-700"} 
        text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base mb-2 w-full`}
            >
              {`TYPE : ${list[currMap].type} : ${currMap}`}
            </button>


            <button
              onClick={() => setIsChat((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base mb-2 w-full"
            >
              {isChat ? "Hide Chat" : "Show Chat"}
            </button>


            <button
              onClick={() => setIsMap((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base mb-2 w-full"
            >
              {isMap ? "Hide Map" : "Show Map"}
            </button>


            <button
              className={`${server.length > 0 ? "bg-green-700" : "bg-yellow-700"} 
        text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base mb-2 w-full`}
              disabled
            >
              {server.length === 0 ? "NO SERVER CONNECTED" : server}
            </button>


            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base w-full"
            >
            Log Out
            </button>
            </div>
            )}
            </div> */}





      {/* <div className="items-center relative lg:flex lg:flex-row flex-col ">

        <button
          onClick={() => setIsDropdownOpen((prev) => !prev)}
          className="w-auto bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base"
        >
          Open Dropdown
        </button>

        {isDropdownOpen && (
          <div className="absolute lg:w-auto w-[100%] lg:static bg-black text-white mt-2 lg:mt-0 lg:ml-2 p-3 sm:p-4 rounded-md shadow-lg space-x-2 flex lg:flex-row flex-col">

            <div className="items-center space-x-2 inline lg:w-auto">
              <label htmlFor="range" className="block text-xs sm:text-sm">
                Select Range:
              </label>
              <input
                id="range"
                type="range"
                min="0"
                max={list.length - 1}
                value={currMap}
                onChange={(e) => setCurrMap(Number(e.target.value))}
                className="bg-pink-600"
              />
            </div>

            <button
              onClick={() => setCurrMap((currMap + 1) % list.length)}
              className={`${currMap % 2 === 0 ? "bg-green-700" : "bg-yellow-700"} 
              text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base`}
            >
              {`TYPE : ${list[currMap].type} : ${currMap}`}
            </button>

            <button
              onClick={() => setIsChat((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
            >
              {isChat ? "Hide Chat" : "Show Chat"}
            </button>

            <button
              onClick={() => setIsMap((prev) => !prev)}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
            >
              {isMap ? "Hide Map" : "Show Map"}
            </button>

            <button
              className={`${server.length > 0 ? "bg-green-700" : "bg-yellow-700"} 
          text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base`}
              disabled
            >
              {server.length === 0 ? "NO SERVER CONNECTED" : server}
            </button>

            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
            >
              Log Out
            </button>
          </div>
        )}
      </div> */}


<div className="w-full flex flex-col lg:flex-row-reverse items-end lg:items-center relative lg:gap-0">
  <button
    onClick={() => setIsDropdownOpen((prev) => !prev)}
    className="bg-blue-600 hover:bg-blue-700  py-1 px-2 sm:py-1.5 sm:px-3 md:py-2 md:px-4 rounded-md transition-all text-xs sm:text-sm md:text-base"
  >
    Open Dropdown
  </button>

  {isDropdownOpen && (
    <div className="bg-black absolute lg:static mt-10 lg:mt-0 lg:mr-2 p-3 sm:p-4 rounded-md shadow-lg flex flex-col lg:flex-row w-auto space-x-2 space-x-reverse">
      <div className="flex items-center space-x-2 space-x-reverse lg:w-auto w-[100%]">
        <label htmlFor="range" className="block text-xs sm:text-sm">
          Select Map:
        </label>
        <input
          id="range"
          type="range"
          min="0"
          max={list.length - 1}
          value={currMap}
          onChange={(e) => setCurrMap(Number(e.target.value))}
          className="bg-pink-600 w-full lg:w-auto"
        />
      </div>

      <button
        onClick={() => setCurrMap((currMap + 1) % list.length)}
        className={`${currMap % 2 === 0 ? "bg-green-700" : "bg-yellow-700"} 
          text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base`}
      >
        {`TYPE : ${list[currMap].type} : ${currMap}`}
      </button>

      <button
        onClick={() => setIsChat((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
      >
        {isChat ? "Hide Chat" : "Show Chat"}
      </button>

      <button
        onClick={() => setIsMap((prev) => !prev)}
        className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
      >
        {isMap ? "Hide Map" : "Show Map"}
      </button>

      <button
        className={`${server.length > 0 ? "bg-green-700" : "bg-yellow-700"} 
          text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base`} 
        disabled
      >
        {server.length === 0 ? "NO SERVER CONNECTED" : server}
      </button>

      <button
        onClick={logout}
        className="bg-red-600 hover:bg-red-700 text-white py-1 px-2 rounded-md transition-all text-xs sm:text-sm md:text-base"
      >
        Log Out
      </button>
    </div>
  )}
</div>


</div>
  );
};

export default Header;

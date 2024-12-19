import React, { useContext } from "react";
import { UserContext } from "../src/App";

export const Client1 = () => {
  const { clients } = useContext(UserContext);
  return (
    <div className=" bg-white p-4 rounded-lg shadow-lg overflow-y-scroll max-h-[100%] max-w-[20%] overflow-x-hidden">
      {/* <h2 className="text-lg font-semibold mb-2 text-gray-800">Client List</h2> */}
      <div className="overflow-y-auto max-h-60">
      {/* <h3  className="text-gray-700 text-sm px-4">golu</h3>
      <h3  className="text-gray-700 text-sm px-4">golu</h3>
      <h3  className="text-gray-700 text-sm px-4">golu</h3> */}
        {clients.map((item, index) => (
          <h3 key={index} className="text-gray-700 text-sm px-4">
            {item.username}
          </h3>
        ))}
      </div>
    </div>
  );
};

export default Client1;

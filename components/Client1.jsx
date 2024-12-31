import React, { useContext } from "react";
import { SocketContext } from "../providers/SocketProvider";

export const Client1 = () => {
  const { clients } = useContext(SocketContext);
  return (
    <div className=" bg-white p-4 rounded-lg shadow-lg overflow-y-scroll max-h-[100%] max-w-[20%] overflow-x-hidden  lg:block">
      <div className="overflow-y-auto max-h-60">

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

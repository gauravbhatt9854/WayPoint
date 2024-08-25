import React, { useContext } from "react";
import { UserContext } from "../src/App";

export const Client1 = () => {
  const { clients } = useContext(UserContext);
  return (
    <div className=" overflow-scroll">
      {clients.map((item, index) => {
        return <h3 key={index}>{item.username}</h3>;
      })}
    </div>
  );
};
export default Client1;

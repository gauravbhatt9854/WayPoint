import React, { useContext } from "react";
import { UserContext } from "../src/App";

export const Client1 = () => {
  const { clients } = useContext(UserContext);
  return (
    <div className=" overflow-scroll">
      {clients.map((item) => {
        return (
          <>
            <h3>{item.username}</h3>
          </>
        );
      })}
    </div>
  );
};
export default Client1;

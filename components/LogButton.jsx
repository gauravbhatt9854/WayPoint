import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { UserContext } from "../src/App";
import Client1 from "./Client1";
import Chat from "./Chat";

const LoginButton = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } =
    useAuth0();

  return (
    <div className="w-screen h-[15%] border-green-200  border-2  ">
      {isAuthenticated ? (
        <div className="box flex justify-between">
          <div className="left">
            <div className=" flex gap-4">
              <div className="h-10 w-10 rounded">
                <img src={user.picture} alt="profile" />
              </div>
              <h1>{user?.name} </h1>
              <button onClick={logout}>log out</button>
            </div>
          </div>
          {/* right part  */}
          <Client1></Client1>
        </div>
      ) : (
        <div className="flex gap-4">
          <button onClick={() => loginWithRedirect()}>Log In</button>
        </div>
      )}
    </div>
  );
};

export default LoginButton;

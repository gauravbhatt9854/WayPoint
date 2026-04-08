import { GoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../providers/UserProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

useEffect(() => {
  if (user) {
    navigate("/");
  }
}, [user]);

const handleSuccess = async (credentialResponse) => {
  const googleToken = credentialResponse.credential;
  if (!googleToken) return;

  try {
    const res = await fetch(import.meta.env.VITE_SOCKET_SERVER+"/auth/google", {
      method: "POST",
      credentials:"include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: googleToken }),
    });

    if (!res.ok) throw new Error("Auth failed");

    const data = await res.json();
    
    // ✅ set user from backend
    setUser(data.user);

  } catch (err) {
    console.error(err);
  }
};

  const handleError = () => {
    console.log("Login Failed");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-sm w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome</h1>

        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          width={300}
          text="continue_with"
        />
      </div>
    </div>
  );
};

export default LoginPage;
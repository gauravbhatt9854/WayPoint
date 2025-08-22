import { GoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../providers/UserProvider";

const LoginPage = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  const SERVER_URL = import.meta.env.VITE_SOCKET_SERVER; // e.g., http://localhost:3000
  // --- Fetch logged-in user on mount ---
  const fetchUser = async () => {
    try {

      console.log("Fetching user...");
      const res = await fetch(`${SERVER_URL}/me`, {
        method: "GET",
        credentials: "include" // send HttpOnly cookie
      });
      if (!res.ok) return;
      const data = await res.json();
      setUser(() => data.user);
      navigate("/"); // redirect home
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  // --- Handle Google login success ---
  const handleSuccess = async (credentialResponse) => {
    const googleToken = credentialResponse.credential;
    if (!googleToken) return;

    try {
      const res = await fetch(`${SERVER_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: googleToken }),
        credentials: "include"
      });

      const data = await res.json(); // important
      if (res.ok) {
        fetchUser();
      } else {
        console.error("Login failed:", data.message);
      }
    } catch (err) {
      console.error("Error logging in:", err);
    }
  };

  const handleError = () => {
    console.log("Login Failed");
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center p-6 max-w-sm w-full bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">Welcome</h1>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          text="continue_with"
          width="100%"
        />
      </div>
    </div>
  );
};

export default LoginPage;
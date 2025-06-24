import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:4000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login failed:", err.response?.data?.msg || err.message);
      setErr(err.response?.data?.msg || "Login failed");
    }
  };

  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-8 rounded shadow-md w-80"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">SLMS Login</h2>

          {err && <p className="text-red-500 mb-2">{err}</p>}

          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border mb-3 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border mb-4 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
          <p className="text-sm mt-4 text-center">
              Don't have an account?{" "}
              <span
                  className="text-blue-600 cursor-pointer hover:underline"
                  onClick={() => navigate("/register")}
              >
                  Register
              </span>
              </p>
        </form>
      </div>
  );
}

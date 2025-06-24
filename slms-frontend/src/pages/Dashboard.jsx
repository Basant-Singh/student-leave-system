import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const navigate = useNavigate();
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;


  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-gray-700 mb-4">Role: {user?.role}</p>

          <div className="flex flex-col space-y-3">
            <button
              onClick={() => navigate("/apply-leave")}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Apply for Leave
            </button>

            <button
              onClick={() => navigate("/my-leaves")}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              View My Leaves
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

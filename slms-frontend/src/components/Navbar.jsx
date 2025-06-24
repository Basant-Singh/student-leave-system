import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  if (!user) return null; // No navbar if not logged in

  const isAdmin = user.role === "admin";

  return (
    <nav
      className={`${
        isAdmin ? "bg-purple-700" : "bg-blue-600"
      } text-white px-6 py-3 flex justify-between items-center shadow`}
    >
      <div className="text-lg font-bold">SLMS - {isAdmin ? "Admin" : "Student"}</div>

      <div className="space-x-4">
        {isAdmin ? (
          <>
            <Link to="/admin" className="hover:underline">Admin Panel</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
            <Link to="/apply-leave" className="hover:underline">Apply Leave</Link>
            <Link to="/my-leaves" className="hover:underline">My Leaves</Link>
          </>
        )}

        <button
          onClick={handleLogout}
          className="ml-4 bg-white text-black px-3 py-1 rounded hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

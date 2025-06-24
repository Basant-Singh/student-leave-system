import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    document.title = "SLMS - My Leaves";
    const fetchLeaves = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/leave/mine", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setLeaves(res.data.leaves || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching leaves:", error);
        setErr("Unable to fetch your leaves");
        setLoading(false);
      }
    };

    fetchLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto bg-white shadow-md rounded p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">My Leave Requests</h2>

          {loading && <p>Loading...</p>}
          {err && <p className="text-red-500">{err}</p>}

          {!loading && leaves.length === 0 && (
            <p className="text-gray-600 text-center">No leave requests found.</p>
          )}

          <ul className="space-y-4">
            {Array.isArray(leaves) && leaves.map((leave) => (
              <li
                key={leave._id}
                className="border rounded p-4 bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center"
              >
                <div>
                  <p className="font-semibold">{leave.reason}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(leave.fromDate).toLocaleDateString()} →{" "}
                    {new Date(leave.toDate).toLocaleDateString()}
                  </p>
                </div>
                <span
                  className={`mt-2 sm:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${
                    leave.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : leave.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {leave.status.toUpperCase()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

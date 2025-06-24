import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("token");

  const fetchAllLeaves = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/leave/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLeaves(res.data.leaves || []);
      console.log(res.data)
    } catch (error) {
      console.error("Error:", error);
      setErr("Could not fetch leave requests.");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:4000/api/leave/update/${id}`,
        { status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllLeaves(); // refresh list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchAllLeaves();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen bg-gray-100 p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Admin Leave Panel</h2>

        {err && <p className="text-red-500">{err}</p>}

        <div className="space-y-4">
          {leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-white p-4 rounded shadow flex flex-col sm:flex-row sm:justify-between sm:items-center"
            >
              <div>
                <p className="font-semibold">{leave.reason}</p>
                <p className="text-sm text-gray-600">
                  {new Date(leave.fromDate).toLocaleDateString()} →{" "}
                  {new Date(leave.toDate).toLocaleDateString()}
                </p>
                <p className="text-sm">By: {leave.studentId?.name} ({leave.studentId?.email})</p>
              </div>

              <div className="mt-3 sm:mt-0 space-x-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    leave.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : leave.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {leave.status.toUpperCase()}
                </span>

                {leave.status === "pending" && (
                  <>
                    <button
                      onClick={() => updateStatus(leave._id, "approved")}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(leave._id, "rejected")}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

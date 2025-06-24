import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

export default function AdminDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [err, setErr] = useState("");
  const token = localStorage.getItem("token");
  const [comments, setComments] = useState({});


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

  const handleCommentChange = (id, value) => {
    setComments((prev) => ({ ...prev, [id]: value }));
  };

  const handleAction = async (id, action) => {
    const token = localStorage.getItem("token");
    const comment = comments[id] || "";

    try {
      await axios.put(
        `http://localhost:4000/api/leave/update/${id}`,
        { status: action, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchAllLeaves(); // refresh the list
    } catch (error) {
      console.error("Error updating leave:", error);
    }
  };


  useEffect(() => {
    document.title = "SLMS - Admin Dashboard";
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

              <div className="mt-3 sm:mt-0 space-x-2 flex flex-col items-end">
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
                {leave.status !== "pending" && leave.adminComment && (
                  <p className="text-sm text-gray-600 mt-2">
                    <strong>Comment:</strong> {leave.adminComment}
                  </p>
                )}
                {leave.status === "pending" && (
                  <div className="mt-2">
                    <textarea
                      placeholder="Admin comment (optional)"
                      value={comments[leave._id] || ""}
                      onChange={(e) => handleCommentChange(leave._id, e.target.value)}
                      className="w-full border p-2 rounded"
                    />

                    <div className="flex justify-end space-x-2 mt-2">
                      <button
                        onClick={() => handleAction(leave._id, "approved")}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleAction(leave._id, "rejected")}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                

              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

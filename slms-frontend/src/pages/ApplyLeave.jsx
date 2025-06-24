import { useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ApplyLeave() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:4000/api/leave/apply",
        { reason, fromDate, toDate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMsg("Leave applied successfully!");
      setReason("");
      setFromDate("");
      setToDate("");

      setTimeout(() => {
        navigate("/my-leaves");
      }, 1500);
    } catch (error) {
      console.error("Leave apply failed:", error);
      setErr(error.response?.data?.msg || "Error submitting leave");
    }
  };

  useEffect(() => {
    document.title = "SLMS - Apply Leave";
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow-md w-full max-w-md"
        >
          <h2 className="text-xl font-bold mb-4 text-center">Apply for Leave</h2>

          {msg && <p className="text-green-600 mb-2">{msg}</p>}
          {err && <p className="text-red-500 mb-2">{err}</p>}

          <input
            type="text"
            placeholder="Reason for leave"
            className="w-full border p-2 mb-3 rounded"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            required
          />

          <label className="block mb-1 text-sm font-semibold">From Date</label>
          <input
            type="date"
            className="w-full border p-2 mb-3 rounded"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            required
          />

          <label className="block mb-1 text-sm font-semibold">To Date</label>
          <input
            type="date"
            className="w-full border p-2 mb-4 rounded"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Submit Leave
          </button>
        </form>
      </div>
    </div>
  );
}

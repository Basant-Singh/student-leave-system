const express = require("express");
const Leave = require("../models/Leave");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Apply for leave (Student)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { reason, fromDate, toDate } = req.body;

    const leave = new Leave({
      studentId: req.user._id,
      reason,
      fromDate,
      toDate,
    });

    await leave.save();
    res.status(201).json({ msg: "Leave applied", leave });
  } catch (err) {
    console.error("Apply leave error:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// View own leaves (Student)
router.get("/mine", authMiddleware, async (req, res) => {
  try {
    const leaves = await Leave.find({ studentId: req.user._id }).sort({ appliedAt: -1 });
    res.json({leaves});
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// View all leaves (Admin only)
router.get("/all", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  try {
    const leaves = await Leave.find().populate("studentId", "name email").sort({ appliedAt: -1 });
    res.json({leaves});
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Approve/Reject Leave (Admin)
router.put("/update/:id", authMiddleware, async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied" });
  }

  const { status } = req.body;

  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ msg: "Invalid status" });
  }

  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave) return res.status(404).json({ msg: "Leave not found" });

    leave.status = status;
    await leave.save();

    res.json({ msg: `Leave ${status}`, leave });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;

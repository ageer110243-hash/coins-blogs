import User from "../models/user.model.js";
import Message from "../models/message.model.js";

const ONLINE_WINDOW_MS = 5 * 60 * 1000; // considered "online" if seen in the last 5 minutes

export const getStats = async (req, res) => {
  try {
    const now = new Date();
    const onlineSince = new Date(now.getTime() - ONLINE_WINDOW_MS);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [totalUsers, totalMessages, onlineNow, newSignups7d] =
      await Promise.all([
        User.countDocuments(),
        Message.countDocuments(),
        User.countDocuments({ lastSeen: { $gte: onlineSince } }),
        User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      ]);

    res.status(200).json({ totalUsers, totalMessages, onlineNow, newSignups7d });
  } catch (error) {
    console.error("getStats error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const now = new Date();
    const onlineSince = new Date(now.getTime() - ONLINE_WINDOW_MS);

    const [users, messageCounts] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }),
      Message.aggregate([
        { $group: { _id: "$senderId", count: { $sum: 1 } } },
      ]),
    ]);

    const countByUserId = new Map(
      messageCounts.map((m) => [m._id.toString(), m.count])
    );

    const result = users.map((u) => ({
      _id: u._id,
      fullName: u.fullName,
      email: u.email,
      profilePic: u.profilePic,
      role: u.role,
      status: u.status,
      createdAt: u.createdAt,
      online: u.lastSeen >= onlineSince,
      messagesSent: countByUserId.get(u._id.toString()) || 0,
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error("getUsers error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getWeeklyActivity = async (req, res) => {
  try {
    const days = [];
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);
      days.push({ dayStart, dayEnd, label: dayLabels[dayStart.getDay()] });
    }

    const counts = await Promise.all(
      days.map(({ dayStart, dayEnd }) =>
        Message.countDocuments({
          createdAt: { $gte: dayStart, $lt: dayEnd },
        })
      )
    );

    const activity = days.map((d, i) => ({ label: d.label, value: counts[i] }));
    res.status(200).json(activity);
  } catch (error) {
    console.error("getWeeklyActivity error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const suspendUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't suspend yourself" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = user.status === "suspended" ? "active" : "suspended";
    await user.save();

    res.status(200).json({ _id: user._id, status: user.status });
  } catch (error) {
    console.error("suspendUser error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You can't delete yourself" });
    }

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    await Promise.all([
      User.findByIdAndDelete(id),
      Message.deleteMany({ $or: [{ senderId: id }, { receiverId: id }] }),
    ]);

    res.status(200).json({ message: "User deleted" });
  } catch (error) {
    console.error("deleteUser error:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

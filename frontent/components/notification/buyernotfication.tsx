// BuyerNotificationPanel.tsx
"use client";
import { useEffect, useState } from "react";
import axios from "axios";

const BuyerNotificationPanel = ({ userId }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/notifications?userId=${userId}&userType=buyer`)
      .then((res) => setNotifications(res.data))
      .catch((err) => console.error(err));
  }, [userId]);

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Your Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((note, i) => (
          <li key={i} className="border p-2 rounded">
            {note.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyerNotificationPanel;

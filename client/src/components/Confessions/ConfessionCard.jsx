import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function ConfessionCard({ confession, onAction }) {
  const { user, token } = useContext(AuthContext);
  const [likeCount, setLikeCount] = useState(confession.likes.length);

  const like = async () => {
    await axios.post(`/confessions/${confession._id}/like`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLikeCount(likeCount + (confession.likes.includes(user?.id) ? -1 : 1));
    if (onAction) onAction();
  };

  const report = async () => {
    if (window.confirm("Report this confession?")) {
      await axios.post(`/confessions/${confession._id}/report`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert("Reported. Our moderators will review this confession.");
      if (onAction) onAction();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow flex flex-col gap-1">
      <div className="flex gap-2 items-center justify-between">
        <span className="font-semibold text-md">Anonymous</span>
        <span className="text-xs opacity-60">{new Date(confession.createdAt).toLocaleString()}</span>
      </div>
      <div className="mb-2">{confession.text}</div>
      <div className="flex gap-2">
        <button className="btn btn-xs btn-secondary" onClick={like} disabled={!user}>
          👍 {likeCount}
        </button>
        <button className="btn btn-xs btn-accent" onClick={report} disabled={!user}>
          🚩 Report
        </button>
      </div>
    </div>
  );
}
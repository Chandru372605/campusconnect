import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function ConfessionFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    try {
      await axios.post("/confessions", { text }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setText("");
      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Error!");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <form
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-full max-w-md"
        onSubmit={submit}
      >
        <h2 className="text-xl font-bold mb-2">Share Confession</h2>
        <textarea
          required
          rows={5}
          placeholder="Your message (anonymous)…"
          value={text}
          onChange={e => setText(e.target.value)}
          className="textarea textarea-bordered w-full"
        />
        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>Post</button>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
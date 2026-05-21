import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function PlacementFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    title: "", body: "", company: "", tags: ""
  });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await axios.post("/placement", state, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center">
      <form
        className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-full max-w-md"
        onSubmit={submit}
      >
        <h2 className="text-xl font-bold mb-2">Share Experience/Opening</h2>
        <input
          required type="text" className="input input-bordered w-full"
          placeholder="Title" value={state.title}
          onChange={e => setState(s => ({ ...s, title: e.target.value }))}
        />
        <textarea
          required className="textarea textarea-bordered w-full mt-2"
          placeholder="Content" rows={4}
          value={state.body}
          onChange={e => setState(s => ({ ...s, body: e.target.value }))}
        />
        <input
          className="input input-bordered w-full mt-2"
          placeholder="Company" value={state.company}
          onChange={e => setState(s => ({ ...s, company: e.target.value }))}
        />
        <input
          className="input input-bordered w-full mt-2"
          placeholder="Tags (comma separated)"
          value={state.tags}
          onChange={e => setState(s => ({ ...s, tags: e.target.value }))}
        />
        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>Post</button>
          <button className="btn" onClick={onClose} type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}
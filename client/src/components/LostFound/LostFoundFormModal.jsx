import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function LostFoundFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    title: "", description: "", contact: "", status: "lost", image: null
  });
  const [imgPrev, setImgPrev] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFile = e => {
    const file = e.target.files[0];
    setState(s => ({ ...s, image: file }));
    setImgPrev(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(state).forEach(([k, v]) => k === "image" ? v && fd.append("image", v) : fd.append(k, v));
    try {
      await axios.post("/lostfound", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Error reporting item.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <form className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow w-full max-w-md space-y-2" onSubmit={handleSubmit}>
        <h2 className="text-xl font-bold">Report Item</h2>
        <input
          required
          type="text"
          placeholder="Title"
          value={state.title}
          onChange={e => setState(s => ({ ...s, title: e.target.value }))}
          className="input input-bordered w-full"
        />
        <textarea
          required
          placeholder="Description"
          value={state.description}
          onChange={e => setState(s => ({ ...s, description: e.target.value }))}
          className="textarea textarea-bordered w-full"
        />
        <input
          type="text"
          placeholder="Contact info"
          value={state.contact}
          onChange={e => setState(s => ({ ...s, contact: e.target.value }))}
          className="input input-bordered w-full"
        />
        <select
          value={state.status}
          onChange={e => setState(s => ({ ...s, status: e.target.value }))}
          className="select select-bordered w-full"
        >
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="file-input file-input-bordered w-full"
        />
        {imgPrev && <img src={imgPrev} alt="preview" className="w-24 h-24 mt-2 rounded object-cover" />}
        <div className="flex gap-2 mt-3">
          <button className="btn btn-primary" type="submit" disabled={loading}>Add</button>
          <button className="btn" onClick={onClose} type="button">Cancel</button>
        </div>
      </form>
    </div>
  );
}
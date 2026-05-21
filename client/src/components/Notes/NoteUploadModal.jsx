import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function NoteUploadModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    title: "", description: "", branch: "CSE", semester: "1", subject: "", file: null
  });
  const [loading, setLoading] = useState(false);

  const handleFile = e => setState(s => ({ ...s, file: e.target.files[0] }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(state).forEach(([k, v]) => k === "file"
      ? v && fd.append("file", v)
      : fd.append(k, v));
    try {
      await axios.post("/notes", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
      });
      onClose();
    } catch (e) {
      alert(e?.response?.data?.error || "Error uploading note.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form className="bg-white dark:bg-gray-900 p-5 rounded-lg max-w-md w-full shadow"
            onSubmit={submit}>
        <h2 className="font-bold mb-2 text-xl">Upload Note (PDF)</h2>
        <input required className="input input-bordered w-full mb-2" placeholder="Title"
               value={state.title}
               onChange={e => setState(s => ({ ...s, title: e.target.value }))} />
        <input className="input input-bordered w-full mb-2" placeholder="Subject"
               value={state.subject}
               onChange={e => setState(s => ({ ...s, subject: e.target.value }))} />
        <textarea required className="textarea textarea-bordered w-full mb-2" placeholder="Description"
                  value={state.description}
                  onChange={e => setState(s => ({ ...s, description: e.target.value }))} />
        <select className="select select-bordered w-full mb-2"
                value={state.branch} onChange={e => setState(s => ({ ...s, branch: e.target.value }))}>
          <option>CSE</option>
          <option>ECE</option>
          <option>EEE</option>
          <option>MECH</option>
        </select>
        <select className="select select-bordered w-full mb-2"
                value={state.semester} onChange={e => setState(s => ({ ...s, semester: e.target.value }))}>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
        </select>
        <input required type="file" accept="application/pdf"
               className="file-input file-input-bordered w-full mb-2"
               onChange={handleFile} />
        <div className="flex gap-2 mt-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>Upload</button>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
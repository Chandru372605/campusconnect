import React, { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import NoteCard from "../components/Notes/NoteCard";
import NoteUploadModal from "../components/Notes/NoteUploadModal";
import { AuthContext } from "../context/AuthContext";

export default function Notes() {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [modal, setModal] = useState(false);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    setLoading(true);
    const { data } = await axios.get(
      `/notes?branch=${encodeURIComponent(branch)}&semester=${encodeURIComponent(semester)}&q=${encodeURIComponent(q)}`
    );
    setNotes(data);
    setLoading(false);
  };

  useEffect(() => { fetchNotes(); /* eslint-disable-next-line */ }, [branch, semester]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex-1">Notes Sharing</h1>
        <input
          placeholder="Search notes"
          className="input input-bordered"
          value={q}
          onChange={e => setQ(e.target.value)}
          onBlur={fetchNotes}
        />
        <select
          className="select select-bordered"
          value={branch}
          onChange={e => { setBranch(e.target.value); }}
        >
          <option value="">All Branches</option>
          <option>CSE</option>
          <option>EEE</option>
          <option>ECE</option>
          <option>MECH</option>
          {/* Add branches */}
        </select>
        <select
          className="select select-bordered"
          value={semester}
          onChange={e => setSemester(e.target.value)}
        >
          <option value="">All Semesters</option>
          {[1,2,3,4,5,6,7,8].map(s => <option key={s}>{s}</option>)}
        </select>
        {user && (
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ Upload Note</button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading
          ? <div>Loading…</div>
          : notes.length === 0
          ? <div>No notes found.</div>
          : notes.map(note => (
            <NoteCard key={note._id} note={note} onAction={fetchNotes} />
          ))}
      </div>
      {modal &&
        <NoteUploadModal onClose={() => { setModal(false); fetchNotes(); }} />
      }
    </div>
  );
}
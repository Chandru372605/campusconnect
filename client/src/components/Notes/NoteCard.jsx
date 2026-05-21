import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function NoteCard({ note, onAction }) {
  const { user, token } = useContext(AuthContext);
  const [votes, setVotes] = useState(note.upvotes.length);
  const [preview, setPreview] = useState(false);

  const upvote = async () => {
    if (!user) return alert("Login to upvote");
    await axios.post(`/notes/${note._id}/upvote`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setVotes(v => note.upvotes.includes(user.id) ? v - 1 : v + 1);
    onAction();
  };

  const download = () => {
    window.open(note.fileUrl, "_blank");
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col p-4">
      <div className="flex gap-2 items-center mb-2">
        <div className="font-bold">{note.title}</div>
        {note.branch && <span className="badge badge-info">{note.branch}</span>}
        {note.semester && <span className="badge">{note.semester}</span>}
        <span className="text-xs ml-auto opacity-60">{new Date(note.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="mb-2 text-gray-700 dark:text-gray-300">{note.description}</div>
      <div className="flex gap-2 mb-2">
        <button className="btn btn-xs btn-accent" onClick={download}>
          Download PDF
        </button>
        <button className="btn btn-xs" onClick={() => setPreview(p => !p)}>
          {preview ? "Hide Preview" : "Preview"}
        </button>
        <button className="btn btn-xs btn-secondary" onClick={upvote}>
          👍 {votes}
        </button>
      </div>
      {preview && (
        <iframe
          src={note.fileUrl}
          title="preview"
          className="w-full h-72 rounded border"
        />
      )}
      <div className="flex gap-1 text-xs items-center text-gray-500 mt-2">
        {note.uploader?.avatar &&
          <img src={note.uploader.avatar} alt="" className="w-5 h-5 rounded-full" />}
        <span>{note.uploader?.name}</span>
      </div>
    </div>
  );
}
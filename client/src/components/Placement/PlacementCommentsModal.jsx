import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function PlacementCommentsModal({ post, onClose }) {
  const { user, token } = useContext(AuthContext);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState(post.comments || []);

  const addComment = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { data } = await axios.post(`/placement/${post._id}/comment`, { text }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLoading(false);
    setText("");
    setComments([...comments, { ...data, user: { name: user?.name, avatar: user?.avatar } }]);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-4 max-w-md w-full">
        <h2 className="text-lg font-bold mb-2">Discussion · {post.title}</h2>
        <div className="overflow-y-auto max-h-64 mb-3">
          {comments.length === 0 && <div>No comments yet.</div>}
          {comments.map((c, i) => (
            <div key={i} className="flex gap-2 items-center mb-2">
              {c.user?.avatar && <img src={c.user.avatar} alt="" className="w-5 h-5 rounded-full" />}
              <b className="text-sm">{c.user?.name || "Anonymous"}</b>
              <span className="opacity-50 text-xs">{new Date(c.createdAt).toLocaleString()}</span>
              <span className="ml-2">{c.text}</span>
            </div>
          ))}
        </div>
        {user && (
          <form onSubmit={addComment} className="flex gap-2 mt-2">
            <input
              className="input input-bordered flex-1" value={text}
              onChange={e => setText(e.target.value)}
              required placeholder="Your comment"
            />
            <button className="btn btn-primary" type="submit" disabled={loading}>Add</button>
          </form>
        )}
        <button className="btn btn-sm mt-2" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
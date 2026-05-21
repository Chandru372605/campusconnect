import React, { useEffect, useState, useContext } from 'react';
import axios from "../services/api";
import LostFoundCard from "../components/LostFound/LostFoundCard";
import LostFoundFormModal from "../components/LostFound/LostFoundFormModal";
import { AuthContext } from "../context/AuthContext";

export default function LostFound() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchPosts = async () => {
    const { data } = await axios.get("/lostfound");
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Lost & Found</h1>
        {user && (
          <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
            + Report Item
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.length === 0 && <div>No lost or found items reported yet.</div>}
        {posts.map(p => <LostFoundCard key={p._id} post={p} onResolve={fetchPosts} />)}
      </div>
      {modalOpen && (
        <LostFoundFormModal
          onClose={() => { setModalOpen(false); fetchPosts(); }}
        />
      )}
    </div>
  );
}
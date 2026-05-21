import React, { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import PlacementCard from "../components/Placement/PlacementCard";
import PlacementFormModal from "../components/Placement/PlacementFormModal";
import { AuthContext } from "../context/AuthContext";

export default function Placement() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(false);
  const [company, setCompany] = useState('');
  const [search, setSearch] = useState("");

  const fetchPosts = async () => {
    const { data } = await axios.get(`/placement?company=${encodeURIComponent(company)}&q=${encodeURIComponent(search)}`);
    setPosts(data);
  };

  useEffect(() => { fetchPosts(); /* eslint-disable-next-line */ }, [company]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex flex-wrap gap-2 mb-4 items-end">
        <h1 className="flex-1 text-2xl font-bold">Placement Hub</h1>
        <input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)}
               className="input input-bordered"
               onBlur={fetchPosts}
        />
        <input
          type="text"
          placeholder="Company"
          value={company}
          onChange={e => setCompany(e.target.value)}
          className="input input-bordered"
          onBlur={fetchPosts}
        />
        {user && (
          <button className="btn btn-primary" onClick={() => setModal(true)}>+ New Post</button>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {posts.length === 0 && <div>No posts yet.</div>}
        {posts.map(p => <PlacementCard key={p._id} post={p} />)}
      </div>
      {modal &&
        <PlacementFormModal onClose={() => { setModal(false); fetchPosts(); }} />
      }
    </div>
  );
}
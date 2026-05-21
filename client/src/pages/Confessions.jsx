import React, { useEffect, useState, useContext } from "react";
import axios from "../services/api";
import ConfessionCard from "../components/Confessions/ConfessionCard";
import ConfessionFormModal from "../components/Confessions/ConfessionFormModal";
import { AuthContext } from "../context/AuthContext";

export default function Confessions() {
  const { user } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);
  const [confs, setConfs] = useState([]);
  const [trending, setTrending] = useState(false);

  const fetchConfs = async () => {
    const { data } = await axios.get(trending ? "/confessions/trending" : "/confessions");
    setConfs(data);
  };

  useEffect(() => { fetchConfs(); }, [trending]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="font-bold text-2xl">Confessions</h1>
        {!!user && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Confess
          </button>
        )}
      </div>
      <div className="mb-4 flex gap-2">
        <button className={`btn btn-sm ${!trending && "btn-active"}`} onClick={() => setTrending(false)}>
          Recent
        </button>
        <button className={`btn btn-sm ${trending && "btn-active"}`} onClick={() => setTrending(true)}>
          Trending
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {confs.length === 0 && <div>No confessions yet.</div>}
        {confs.map(conf => (
          <ConfessionCard
            key={conf._id}
            confession={conf}
            onAction={fetchConfs}
          />
        ))}
      </div>
      {showModal &&
        <ConfessionFormModal
          onClose={() => {
            setShowModal(false);
            fetchConfs();
          }}
        />}
    </div>
  );
}
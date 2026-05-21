import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function LostFoundCard({ post, onResolve }) {
  const { user, token } = useContext(AuthContext);
  const isOwner = user && post.postedBy?._id === user.id;

  const handleResolve = async () => {
    if (window.confirm("Mark as resolved?")) {
      await axios.patch(`/lostfound/${post._id}/resolve`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onResolve();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow flex flex-col">
      {post.image && <img src={post.image} alt="" className="w-full h-48 object-cover rounded-t" />}
      <div className="p-3 flex-1 flex flex-col">
        <div className="flex gap-2 items-center mb-2">
          <span className={`badge ${post.status === 'found' ? "badge-success" : "badge-warning"}`}>
            {post.status === 'found' ? "FOUND" : "LOST"}
          </span>
          {post.isResolved && <span className="badge badge-info">Resolved</span>}
        </div>
        <h3 className="font-bold text-lg">{post.title}</h3>
        <div className="text-gray-700 dark:text-gray-300">{post.description}</div>
        <div className="mt-auto pt-2 text-xs">
          {post.postedBy?.avatar && (
            <img src={post.postedBy.avatar} alt="" className="w-5 h-5 rounded-full inline-block mr-1" />
          )}
          {post.contact ? `Contact: ${post.contact}` : ""}
        </div>
        {isOwner && !post.isResolved && (
          <button className="btn btn-sm btn-success mt-2" onClick={handleResolve}>Mark as resolved</button>
        )}
      </div>
    </div>
  );
}
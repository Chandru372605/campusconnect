import React, { useState } from "react";
import PlacementCommentsModal from "./PlacementCommentsModal";

export default function PlacementCard({ post }) {
  const [showComments, setShowComments] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 p-4 rounded shadow flex flex-col gap-1">
      <div className="flex gap-2 items-center mb-2">
        {post.creator?.avatar &&
          <img src={post.creator.avatar} alt="" className="w-7 h-7 rounded-full" />}
        <span className="font-semibold">{post.creator?.name || "Anonymous"}</span>
        <span className="badge badge-info">{post.company}</span>
        <span className="text-xs opacity-60 ml-auto">{new Date(post.createdAt).toLocaleDateString()}</span>
      </div>
      <div className="font-bold">{post.title}</div>
      <div className="mb-2 whitespace-pre-line">{post.body}</div>
      <div className="flex gap-2">
        {post.tags && post.tags.map((t, i) =>
          <span key={i} className="badge badge-accent">{t}</span>
        )}
      </div>
      <button className="btn btn-sm mt-2 btn-outline" onClick={() => setShowComments(true)}>
        Comments ({post.comments.length})
      </button>
      {showComments && (
        <PlacementCommentsModal post={post} onClose={() => setShowComments(false)} />
      )}
    </div>
  );
}
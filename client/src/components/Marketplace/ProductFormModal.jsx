import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "../../services/api";

export default function ProductFormModal({ onClose }) {
  const { token } = useContext(AuthContext);
  const [state, setState] = useState({
    title: "", price: "", description: "", category: "Books", images: [],
  });
  const [imgs, setImgs] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = e => {
    const files = [...e.target.files].slice(0, 4);
    setState(s => ({ ...s, images: files }));
    setImgs(files.map(f => URL.createObjectURL(f)));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    fd.append("title", state.title);
    fd.append("description", state.description);
    fd.append("category", state.category);
    fd.append("price", state.price);
    state.images.forEach(f => fd.append("images", f));
    try {
      await axios.post("/market", fd, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      onClose();
    } catch (err) {
      alert(err?.response?.data?.error || "Error adding product");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-md space-y-2">
        <h2 className="text-xl font-bold mb-2">Add Product</h2>
        <input
          required
          type="text"
          placeholder="Title"
          value={state.title}
          onChange={e => setState(s => ({ ...s, title: e.target.value }))}
          className="input input-bordered w-full mb-2"
        />
        <input
          required
          type="number"
          placeholder="Price"
          value={state.price}
          onChange={e => setState(s => ({ ...s, price: e.target.value }))}
          className="input input-bordered w-full mb-2"
        />
        <textarea
          required
          placeholder="Description"
          value={state.description}
          onChange={e => setState(s => ({ ...s, description: e.target.value }))}
          className="textarea textarea-bordered w-full mb-2"
        />
        <select
          value={state.category}
          onChange={e => setState(s => ({ ...s, category: e.target.value }))}
          className="select select-bordered w-full mb-2"
        >
          <option>Books</option>
          <option>Electronics</option>
          <option>Cycle</option>
          <option>Hostel Supplies</option>
          <option>Others</option>
        </select>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFiles}
          className="file-input file-input-bordered w-full mb-2"
        />
        <div className="flex gap-2 mb-2">
          {imgs.map((img, i) => (
            <img key={i} src={img} alt="preview" className="w-16 h-16 rounded object-cover border" />
          ))}
        </div>
        <div className="flex gap-2 mt-2">
          <button className="btn btn-primary" type="submit" disabled={loading}>Add</button>
          <button className="btn" type="button" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
import React, { useContext, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import axios from "../services/api";

export default function Chat() {
  const { user, token } = useContext(AuthContext);
  const socket = useSocket();
  const [searchParams] = useSearchParams();
  const sellerId = searchParams.get("seller");
  const productId = searchParams.get("product");

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [product, setProduct] = useState(null);
  const bottomRef = useRef();

  useEffect(() => {
    const fetchProductAndChat = async () => {
      if (productId) {
        const { data } = await axios.get(`/market/${productId}`);
        setProduct(data);
      }
      // fetch chat history
      if (productId && sellerId && token) {
        const resp = await axios.get(`/chat/${productId}/${sellerId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(resp.data.messages || []);
      }
    };
    fetchProductAndChat();
    // Socket setup
    if (socket && productId && user) {
      socket.emit("joinRoom", { room: `${productId}-${user._id}-${sellerId}` });
      socket.on("receiveMessage", (msg) => setMessages((m) => [...m, msg]));
    }
    // Cleanup listener on unmount
    return () => {
      if (socket) socket.off("receiveMessage");
    };
    // eslint-disable-next-line
  }, [socket, productId, sellerId, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { content: input, sender: user._id, room: `${productId}-${user._id}-${sellerId}` };
    socket.emit("sendMessage", msg);
    setMessages((prev) => [...prev, { ...msg, createdAt: new Date() }]);
    setInput("");
    // Optionally: POST to backend for permanent storage
    await axios.post(
      `/chat/${productId}/${sellerId}`,
      { content: msg.content },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  };

  return (
    <div className="max-w-xl mx-auto p-4 flex flex-col h-[80vh]">
      <div className="p-4 bg-white dark:bg-gray-800 rounded-t-lg shadow mb-2">
        <b>Chat about:</b> {product?.title}
      </div>
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg flex-1 p-3 overflow-y-auto">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${msg.sender === user._id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-4 py-2 rounded-lg ${
                msg.sender === user._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form className="flex gap-2 mt-2" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input input-bordered flex-1"
          placeholder="Type a message"
        />
        <button type="submit" className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
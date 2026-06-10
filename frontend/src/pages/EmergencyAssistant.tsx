import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaRobot,
  FaUser,
  FaPaperPlane,
  FaImage,
  FaTimes,
  FaSpinner
} from "react-icons/fa";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import { askAssistant } from "../services/assistantService";

interface Message {
  sender: "user" | "bot";
  text: string;
  image?: string;
  timestamp: Date;
}

const quickPrompts = [
  { label: "🔥 Wildfire", text: "What should I do during a wildfire?" },
  { label: "🌊 Flood", text: "How do I survive a flood?" },
  { label: "🌍 Earthquake", text: "What should I do during an earthquake?" },
  { label: "🩹 First Aid", text: "Provide basic first aid tips." },
  { label: "🎒 Emergency Kit", text: "What should be included in an emergency kit?" },
];

export default function EmergencyAssistant() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "bot",
      text: "👋 Hello! I am Sentinel AI Emergency Assistant.\n\nUpload an image or ask me anything about disasters, first aid, evacuation or emergency preparedness.",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !selectedImage) {
      return;
    }

    const userMessage: Message = {
      sender: "user",
      text: input,
      image: preview || undefined,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const data = await askAssistant(input, selectedImage);
      const botMessage: Message = {
        sender: "bot",
        text: data.answer,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.log(error);
      const errorMessage: Message = {
        sender: "bot",
        text: JSON.stringify(error?.response?.data) || "❌ Failed to contact Sentinel AI.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }

    setInput("");
    setSelectedImage(null);
    setPreview("");
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreview("");
  };

  return (
    <div className="min-h-screen bg-[#071226] text-white flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar title="Emergency Assistant" />
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-4xl mx-auto space-y-4">
              <AnimatePresence initial={false}>
                {messages.map((msg, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${
                      msg.sender === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.sender === "bot" && (
                      <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                        <FaRobot className="text-sm" />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.sender === "user"
                          ? "bg-red-600 rounded-tr-sm"
                          : "bg-[#0B1D33] border border-slate-800 rounded-tl-sm"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="uploaded"
                          className="rounded-xl mb-3 max-h-64 w-full object-cover"
                        />
                      )}
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                      <p className="text-xs text-slate-400 mt-2 opacity-70">
                        {msg.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    {msg.sender === "user" && (
                      <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
                        <FaUser className="text-sm" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center">
                    <FaRobot className="text-sm" />
                  </div>
                  <div className="bg-[#0B1D33] border border-slate-800 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <FaSpinner className="animate-spin text-cyan-500" />
                    <span className="text-slate-400">Sentinel AI is analyzing...</span>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 p-4 bg-[#0B1D33]">
            <div className="max-w-4xl mx-auto">
              {/* Image Preview */}
              {preview && (
                <div className="mb-4 flex items-center gap-3 p-3 bg-slate-800 rounded-xl border border-slate-700">
                  <img
                    src={preview}
                    alt="preview"
                    className="h-20 rounded-lg object-cover"
                  />
                  <button
                    onClick={removeImage}
                    className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
                  >
                    <FaTimes className="text-sm" />
                  </button>
                </div>
              )}

              {/* Input Row */}
              <div className="flex gap-3 items-end">
                <input
                  type="file"
                  accept="image/*"
                  id="image-upload"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors cursor-pointer"
                >
                  <FaImage className="text-lg" />
                </label>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    placeholder="Ask about emergencies, first aid, or upload an image..."
                    className="w-full bg-slate-800 rounded-xl px-4 py-3 pr-14 focus:outline-none focus:ring-2 focus:ring-red-500/50 border border-slate-700"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="p-3 bg-red-600 hover:bg-red-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? <FaSpinner className="animate-spin" /> : <FaPaperPlane />}
                </button>
              </div>

              {/* Quick Prompts */}
              <div className="mt-4 flex flex-wrap gap-2">
                {quickPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(prompt.text)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm transition-colors"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
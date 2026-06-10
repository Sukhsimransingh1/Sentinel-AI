import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

import {
  askAssistant,
} from "../services/assistantService";

interface Message {
  sender: "user" | "bot";
  text: string;
  image?: string;
}

export default function EmergencyAssistant() {

  const [input, setInput] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState<File | null>(null);

  const [
    preview,
    setPreview,
  ] = useState("");

  const [
    messages,
    setMessages,
  ] = useState<Message[]>([
    {
      sender: "bot",
      text:
        "👋 Hello! I am Sentinel AI Emergency Assistant.\n\nUpload an image or ask me anything about disasters, first aid, evacuation or emergency preparedness.",
    },
  ]);

  const handleSend = async () => {

    if (
      !input.trim() &&
      !selectedImage
    ) {
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: input,
        image: preview || undefined,
      },
    ]);

    setLoading(true);

    try {

      const data =
        await askAssistant(
          input,
          selectedImage
        );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.answer,
        },
      ]);

    } catch (error: any) {

      console.log(error);

      console.log(
        error?.response?.data
      );

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text:
            JSON.stringify(
              error?.response?.data
            ) ||
            "❌ Failed to contact Sentinel AI.",
        },
      ]);

    }

    setInput("");

    setSelectedImage(null);

    setPreview("");

    setLoading(false);

  };

  return (

    <div className="min-h-screen bg-slate-950 text-white flex">

      <Sidebar />

      <div className="flex-1">

        <Navbar />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">

            🤖 Emergency Assistant

          </h1>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-[550px] overflow-y-auto">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={`flex mb-4 ${
                  msg.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[75%] rounded-xl px-4 py-3 whitespace-pre-wrap ${
                    msg.sender === "user"
                      ? "bg-blue-600"
                      : "bg-slate-800"
                  }`}
                >

                  {msg.image && (

                    <img
                      src={msg.image}
                      alt="uploaded"
                      className="rounded-lg mb-3 max-h-64"
                    />

                  )}

                  {msg.text}

                </div>

              </div>

            ))}

            {loading && (

              <div className="text-slate-400">

                🔍 Sentinel AI is analyzing...

              </div>

            )}

          </div>          {selectedImage && (

            <div className="mt-4">

              <img
                src={preview}
                alt="preview"
                className="max-h-52 rounded-lg border border-slate-700"
              />

            </div>

          )}

          <div className="flex gap-3 mt-5">

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {

                if (e.target.files?.[0]) {

                  const file = e.target.files[0];

                  setSelectedImage(file);

                  setPreview(
                    URL.createObjectURL(file)
                  );

                }

              }}
              className="text-sm"
            />

            <input
              type="text"
              value={input}
              onChange={(e) =>
                setInput(
                  e.target.value
                )
              }
              onKeyDown={(e) => {

                if (e.key === "Enter") {

                  handleSend();

                }

              }}
              placeholder="Ask anything or upload an image..."
              className="flex-1 bg-slate-800 rounded-lg px-4 py-3"
            />

            <button
              onClick={handleSend}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 px-6 rounded-lg disabled:opacity-50"
            >

              {loading
                ? "Analyzing..."
                : "Send"}

            </button>

          </div>

          <div className="mt-6 flex flex-wrap gap-3">

            <button
              onClick={() =>
                setInput(
                  "What should I do during a wildfire?"
                )
              }
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              🔥 Wildfire
            </button>

            <button
              onClick={() =>
                setInput(
                  "How do I survive a flood?"
                )
              }
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              🌊 Flood
            </button>

            <button
              onClick={() =>
                setInput(
                  "What should I do during an earthquake?"
                )
              }
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              🌍 Earthquake
            </button>

            <button
              onClick={() =>
                setInput(
                  "Provide basic first aid tips."
                )
              }
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              🩹 First Aid
            </button>

            <button
              onClick={() =>
                setInput(
                  "What should be included in an emergency kit?"
                )
              }
              className="bg-slate-800 px-4 py-2 rounded-lg"
            >
              🎒 Emergency Kit
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}
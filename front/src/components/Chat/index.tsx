import React, { useState } from "react";

export default function Chat() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Olá! Como posso ajudar?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          text: "Mensagem recebida com sucesso.",
          sender: "bot",
        },
      ]);
    }, 800);
  };

  return (
    <div className="w-full md:w-2/5 min-w-[260px] h-[578px] md:max-w-2xl md:border-r mb-5 border-t border-b md:border-t-0 md:border-b-0 border-blue-800 py-8 md:p-4 flex flex-col flex-grow bg-[#0F172A] overflow-y-auto custom-scrollbar">
      <div className="flex-1 h-0 bg-[#0F172A] rounded p-2 overflow-auto text-blue-200">
        {messages.map((msg) => (
          <div key={msg.id} className="flex gap-2 mb-2">
            <div
              className={`px-4 py-2 rounded-lg max-w-xs ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white ml-auto"
                  : "bg-blue-800 text-blue-100 mr-auto"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-[#1E293B] border border-blue-700 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-400 outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

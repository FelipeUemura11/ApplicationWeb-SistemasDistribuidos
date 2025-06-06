import React, { useState, useRef, useEffect } from "react";
import { serverTimestamp } from "firebase/database";
import { useAuth } from "../../context/authContext";
import * as chatService from "../../services/chatService";

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName?: string;
  timestamp: number | object;
}

interface ChatProps {
  chatId: string | null;
}

export default function Chat({ chatId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!chatId || !currentUser) {
      setMessages([]);
      return;
    }

    const unsubscribe = chatService.onMessages(chatId, (loadedMessages) => {
      setMessages(loadedMessages);
    });

    return () => unsubscribe();
  }, [chatId, currentUser]);

  const handleSendMessage = async () => {
    if (!input.trim() || !chatId || !currentUser) return;

    const newMessageData = {
      text: input,
      senderId: currentUser.uid,
      senderName: currentUser.displayName || "Usuário Anônimo",
      timestamp: serverTimestamp(),
    };

    try {
      await chatService.sendMessage(chatId, newMessageData);
      setInput("");
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  if (!chatId) {
    return (
      <div className="w-full md:w-2/5 min-w-[260px] h-[578px] flex items-center justify-center bg-[#0F172A] text-blue-400">
        <p className="mx-auto flex text-center">
          {" "}
          Selecione um chat para começar a conversar.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/5 min-w-[260px] h-[578px] md:max-w-2xl md:border-r mb-5 border-t border-b md:border-t-0 md:border-b-0 border-blue-800 px-4 py-8 md:p-4 md:py-0 md:pt-4 flex flex-col flex-grow bg-[#0F172A] overflow-y-auto custom-scrollbar">
      <div
        ref={messagesContainerRef}
        className="flex-1 h-0 bg-[#0F172A] rounded p-2 overflow-auto text-blue-200"
      >
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          const isDifferentSender =
            !prevMsg || prevMsg.senderId !== msg.senderId;

          const spacingClass = isDifferentSender ? "mt-4" : "mt-2";

          const formatarHorario = (timestamp: number | any): string => {
            if (!timestamp) return "";

            let date;
            if (typeof timestamp === "object" && timestamp.seconds) {
              date = new Date(timestamp.seconds * 1000);
            } else {
              date = new Date(timestamp);
            }

            return date.toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });
          };

          return (
            <div key={msg.id} className={`flex gap-2 ${spacingClass}`}>
              <div
                className={`px-4 py-2 rounded-lg max-w-xs ${msg.senderId === currentUser?.uid
                    ? "bg-blue-600 text-white ml-auto"
                    : "bg-blue-800 text-blue-100 mr-auto"
                  }`}
              >
                {msg.senderId !== currentUser?.uid && msg.senderName && (
                  <p className="text-xs text-blue-300 mb-1">{msg.senderName}</p>
                )}

                {/* Mensagem e horário */}
                <p>{msg.text}</p>
                <p className="text-xs text-blue-300 mt-1 text-right">
                  {formatarHorario(msg.timestamp)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-[#1E293B] border border-blue-700 rounded-lg px-3 py-2 text-blue-100 placeholder-blue-400 outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

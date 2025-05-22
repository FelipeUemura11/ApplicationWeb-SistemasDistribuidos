import { FC, useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./calendar.css";

// Fazer npm install com big-calendar e date-fns, caso necessário;

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Teste de Evento",
    start: new Date(),
    end: new Date(),
  },
];

const HomePage: FC = () => {
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
    <section className="flex justify-center items-center w-full min-h-[calc(100vh-120px)] pt-40 pb-8 px-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="w-full max-w-7xl rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex overflow-hidden min-h-[600px] px-4 text-blue-100">
        <div className="w-1/5 min-w-[180px] max-w-xs border-r border-blue-800 py-4 bg-[#0F172A] flex-shrink-0 flex flex-col">
          <h2 className="font-bold text-lg text-blue-200 ml-3">Grupos</h2>
          <ul className="space-y-2 flex flex-col mt-[20px] pr-4">
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
            <li className="text-blue-300 flex items-center hover:bg-blue-800/20 px-2 py-3 rounded-md transition">
              <div className="w-[35px] h-[35px] bg-blue-500 rounded-sm inline-block mr-2"></div>
              <div>
                <p className="text-sm font-bold">Nome do Grupo</p>
                <p className="text-xs text-blue-400">Descrição do grupo</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="w-2/5 min-w-[260px] max-w-2xl border-r border-blue-800 p-4 flex flex-col flex-grow bg-[#0F172A]">
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
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Enviar
            </button>
          </div>
        </div>

        <div className="w-2/5 min-w-[260px] max-w-xl p-4 flex flex-col bg-[#0F172A]">
          <h2 className="font-bold text-lg mb-2 text-blue-200">Calendário</h2>
          <div className="flex-1 min-h-[400px] bg-[#0F172A] rounded-lg p-2">
            <Calendar
              className="calendar-dark"
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{
                height: "100%",
                background: "transparent",
                color: "#e0e7ef",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;

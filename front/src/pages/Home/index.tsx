import { FC } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./calendar.css";
import Grupos from "../../components/Grupos";
import Chat from "../../components/Chat";

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
  return (
    <section className="flex justify-center items-center w-full min-h-[calc(100vh-120px)] pt-40 pb-8 px-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="w-full max-w-7xl rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex flex-col md:flex-row overflow-hidden min-h-[600px] px-4 text-blue-100">
        <Grupos />

        <Chat />

        <div className="w-full md:w-2/5 mx-auto min-w-[260px] max-w-xl p-4 flex flex-col bg-[#0F172A]">
          <h2 className="font-bold text-lg mb-2 text-blue-200">Calendário</h2>
          <div className="flex-1 justify-center items-center min-h-[400px] bg-[#0F172A] rounded-lg p-2">
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

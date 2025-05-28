import React, { FC, useState } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./calendar.css";
import TarefaPage from "../TarefaPage/TarefaPage";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarioProps {
  onSelectSlot: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
  events?: Array<{
    title: string;
    start: Date;
    end: Date;
  }>;
}

const Calendario: FC<CalendarioProps> = ({ onSelectSlot, events = [] }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleSelectSlot = (slotInfo: {
    start: Date;
    end: Date;
    slots: Date[];
  }) => {
    setSelectedDate(slotInfo.start);
    onSelectSlot(slotInfo);
  };

  const handleCloseTarefa = () => {
    setSelectedDate(null);
  };

  return (
    <div className="flex-1 min-h-[400px] bg-[#0F172A] rounded-lg p-2 relative">
      <BigCalendar
        className="calendar-dark"
        localizer={localizer}
        events={events}
        selectable={true}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={handleSelectSlot}
        style={{
          height: "578px", 
          background: "transparent",
          color: "#e0e7ef",
        }}
      />
      {selectedDate && (
        <div className="absolute inset-0 bg-[#0F172A] bg-opacity-95 z-10">
          <TarefaPage selectedDate={selectedDate} onClose={handleCloseTarefa} />
        </div>
      )}
    </div>
  );
};

export default Calendario;

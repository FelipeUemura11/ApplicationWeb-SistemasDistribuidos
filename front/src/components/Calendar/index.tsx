import { FC } from "react";
import { Calendar as BigCalendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "../../pages/Home/calendar.css";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface CalendarProps {
  onSelectSlot: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
  events?: Array<{
    title: string;
    start: Date;
    end: Date;
  }>;
}

const Calendar: FC<CalendarProps> = ({ onSelectSlot, events = [] }) => {
  return (
    <div className="flex-1 min-h-[400px] bg-[#0F172A] rounded-lg p-2">
      <BigCalendar
        className="calendar-dark"
        localizer={localizer}
        events={events}
        selectable={true}
        startAccessor="start"
        endAccessor="end"
        onSelectSlot={onSelectSlot}
        style={{
          height: "100%",
          background: "transparent",
          color: "#e0e7ef",
        }}
      />
    </div>
  );
};

export default Calendar; 
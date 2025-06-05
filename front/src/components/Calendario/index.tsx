import React, { FC, useState, useCallback } from "react";
import {
  Calendar as BigCalendar,
  dateFnsLocalizer,
  Views,
  NavigateAction,
  View
} from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import "./calendar.css";

const locales = { "pt-BR": ptBR };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: (date: Date) => startOfWeek(date, { locale: ptBR }),
  getDay,
  locales,
});

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

interface CalendarioProps {
  onSelectSlot: (slotInfo: { start: Date; end: Date; slots: Date[] }) => void;
  events?: CalendarEvent[];
}

const messages = {
  allDay: "Dia inteiro",
  previous: "Anterior",
  next: "Próximo",
  today: "Hoje",
  month: "Mês",
  week: "Semana",
  day: "Dia",
  agenda: "Agenda",
  date: "Data",
  time: "Hora",
  event: "Evento",
  noEventsInRange: "Não há eventos neste período.",
  showMore: (total: number) => `+ Ver mais (${total})`,
};

const Calendario: FC<CalendarioProps> = ({ onSelectSlot, events = [] }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  const handleNavigate = useCallback(
    (newDate: Date, view: View, action: NavigateAction) => {
      setCurrentDate(newDate);
      if (view !== currentView) {
         setCurrentView(view);
      }
      console.log("Navigated to:", newDate, "Action:", action, "View:", view);
    },
    [currentView]
  );

  const handleViewChange = useCallback((newView: View) => {
    setCurrentView(newView);
    console.log("View changed to:", newView);
  }, []);
  
  const internalHandleSelectSlot = useCallback(
    (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
      onSelectSlot(slotInfo);
    },
    [onSelectSlot]
  );

  return (
    <div className="flex-1 min-h-[400px] bg-[#0F172A] rounded-lg p-2 relative">
      <BigCalendar
        className="calendar-dark"
        localizer={localizer}
        events={events}
        selectable={true}
        startAccessor="start"
        endAccessor="end"
        allDayAccessor="allDay"
        date={currentDate}
        view={currentView}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        onSelectSlot={internalHandleSelectSlot}
        views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
        messages={messages}
        style={{
          height: "calc(100% - 20px)",
          minHeight: "500px",
          background: "transparent",
          color: "#e0e7ef",
        }}
      />
    </div>
  );
};

export default Calendario;
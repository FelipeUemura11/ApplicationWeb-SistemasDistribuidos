import { FC, useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "../../components/Calendario/calendar.css";
import Grupos from "../../components/Grupos";
import Chat from "../../components/Chat";
import Calendario from "../../components/Calendario";
import TarefaPage from "../../components/TarefaPage/TarefaPage";
import * as taskService from "../../services/taskService";
import { Task as TarefaType } from "../../services/taskService";

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any;
}

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pageReady, setPageReady] = useState(false);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [showTarefaPage, setShowTarefaPage] = useState(false);
  const [selectedDateForTarefa, setSelectedDateForTarefa] = useState<Date>(new Date());


  useEffect(() => {
    if (!loadingAuth) {
      if (!currentUser) {
        navigate('/');
      } else {
        setPageReady(true);
      }
    }
  }, [loadingAuth, currentUser, navigate]);

  useEffect(() => {
    if (currentUser?.uid && pageReady) {
      const unsubscribe = taskService.listenToUserTasks(
        currentUser.uid,
        null,
        (tasksFromDb) => {
          const eventsForCalendar = tasksFromDb
            .filter(task => task.targetDate)
            .map((task: TarefaType) => ({
              title: task.title,
              start: task.targetDate,
              end: task.targetDate,
              allDay: true,
              resource: task,
            }));
          setCalendarEvents(eventsForCalendar);
        },
        (error) => {
          console.error("Erro ao carregar tarefas para o calendário:", error);
          setCalendarEvents([]);
        },
        (isLoading) => {}
      );
      return () => {
        if (unsubscribe) unsubscribe();
      };
    } else {
      setCalendarEvents([]);
    }
  }, [currentUser, pageReady]);


  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
  };

  const handleSelectCalendarSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    setSelectedDateForTarefa(slotInfo.start);
    setShowTarefaPage(true);
  };

  const handleCloseTarefaPage = () => {
    setShowTarefaPage(false);
  };


  if (loadingAuth || !pageReady) {
    return <div className="flex justify-center items-center h-screen bg-[#0F172A] text-white">Carregando...</div>;
  }

  return (
    <section className="flex mt-24 justify-center items-center w-full min-h-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl h-full rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex flex-col md:flex-row overflow-hidden min-h-[600px] text-blue-100">
        <Grupos onChatSelect={handleChatSelect} activeChatId={activeChatId} />
        <div className="hidden md:block w-px bg-blue-700"></div>
        <Chat chatId={activeChatId} />
        
        <div className="w-full md:w-2/5 md:max-w-md lg:max-w-lg p-4 flex-col bg-[#0F172A] md:flex hidden h-full border-l border-blue-700 relative">
          <h2 className="font-bold text-lg mb-4 text-blue-200 text-center">Calendário</h2>
          <div className="flex-1 min-h-[400px] bg-[#1E293B] rounded-lg p-2 shadow-inner">
            <Calendario
              onSelectSlot={handleSelectCalendarSlot}
              events={calendarEvents}
            />
          </div>
          {showTarefaPage && (
            <div className="absolute inset-0 bg-[#0F172A] bg-opacity-95 z-10 p-4 overflow-y-auto custom-scrollbar">
              <TarefaPage selectedDate={selectedDateForTarefa} onClose={handleCloseTarefaPage} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HomePage;
import { FC, useState, useEffect } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import "../../components/Calendario/calendar.css";
import Grupos from "../../components/Grupos";
import Chat from "../../components/Chat";
import Calendario from "../../components/Calendario";

const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
};
const events = [{ title: "Teste de Evento", start: new Date(), end: new Date() }];

const HomePage: FC = () => {
  const navigate = useNavigate();
  const { currentUser, loadingAuth } = useAuth();
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [pageReady, setPageReady] = useState(false);

  useEffect(() => {
    if (!loadingAuth) {
      if (!currentUser) {
        navigate('/');
      } else {
        setPageReady(true);
      }
    }
  }, [loadingAuth, currentUser, navigate]);

  const handleChatSelect = (chatId: string) => {
    setActiveChatId(chatId);
  };

  if (loadingAuth || !pageReady) {
    return <div className="flex justify-center items-center h-screen bg-[#0F172A] text-white">Carregando...</div>;
  }

  return (
    <section className="flex justify-center items-center w-full min-h-full bg-gradient-to-br from-[#0F172A] to-[#1E293B] p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-7xl h-full rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex flex-col md:flex-row overflow-hidden min-h-[600px] text-blue-100">
        <Grupos onChatSelect={handleChatSelect} activeChatId={activeChatId} />
        <div className="hidden md:block w-px bg-blue-700"></div>
        <Chat chatId={activeChatId} />
        <div className="w-full md:w-2/5 md:max-w-md lg:max-w-lg p-4 flex-col bg-[#0F172A] md:flex hidden h-full border-l border-blue-700">
          <h2 className="font-bold text-lg mb-4 text-blue-200 text-center">Calendário</h2>
          <div className="flex-1 min-h-[400px] bg-[#1E293B] rounded-lg p-2 shadow-inner">
            <Calendario onSelectSlot={handleSelectSlot} events={events} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
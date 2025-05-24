import { FC } from "react";
import Grupos from "../../components/Grupos";
import Chat from "../../components/Chat";
import Calendario from "../../components/Calendario";

const HomePage: FC = () => {
  const events = [
    {
      title: "Teste de Evento",
      start: new Date(),
      end: new Date(),
    },
  ];

  const handleSelectSlot = (slotInfo: { start: Date; end: Date; slots: Date[] }) => {
    // This is now just a pass-through since the state is managed in Calendario
  };

  return (
    <section className="flex justify-center items-center w-full min-h-[calc(100vh-120px)] pt-40 pb-8 px-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="w-full max-w-7xl rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex overflow-hidden min-h-[600px] px-4 text-blue-100">
        <Grupos />
        <Chat />
        <div className="w-2/5 min-w-[260px] max-w-xl p-4 flex flex-col bg-[#0F172A]">
          <h2 className="font-bold text-lg mb-2 text-blue-200">Calendário</h2>
          <Calendario onSelectSlot={handleSelectSlot} events={events} />
        </div>
      </div>
    </section>
  );
};

export default HomePage;

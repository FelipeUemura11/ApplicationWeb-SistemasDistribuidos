import { FC } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import './calendar.css';

// Fazer npm install com big-calendar e date-fns, caso necessário;

const locales = { 'pt-BR': ptBR };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const events = [
  {
    title: 'Teste de Evento',
    start: new Date(),
    end: new Date(),
  },
];

const HomePage: FC = () => {
  return (
    <section className="flex justify-center items-center w-full min-h-[calc(100vh-120px)] pt-40 pb-8 px-2 bg-gradient-to-br from-[#0F172A] to-[#1E293B]">
      <div className="w-full max-w-7xl rounded-2xl shadow-2xl bg-[#0F172A] border border-blue-800 flex overflow-hidden min-h-[600px] px-4 text-blue-100">
        <div className="w-1/5 min-w-[180px] max-w-xs border-r border-blue-800 p-4 bg-[#0F172A] flex-shrink-0 flex flex-col">
          <h2 className="font-bold text-lg mb-2 text-blue-200">Grupos</h2>
          <ul className="space-y-2">
            <li className="text-blue-300">Grupo 1</li>
            <li className="text-blue-300">Grupo 2</li>
            <li className="text-blue-300">Grupo 3</li>
          </ul>
        </div>

        <div className="w-2/5 min-w-[260px] max-w-2xl border-r border-blue-800 p-4 flex flex-col flex-grow bg-[#0F172A]">
          <div className="flex gap-2 mb-4">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded transition">Chat</button>
            <button className="px-4 py-2 bg-green-500 hover:bg-green-700 text-white rounded transition">Tarefas</button>
          </div>
          <div className="flex-1 h-0 bg-[#0F172A] rounded p-4 overflow-auto text-blue-200">
            <p>Conteúdo do Chat ou Lista de Tarefas aparece aqui</p>
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
              style={{ height: '100%', background: 'transparent', color: '#e0e7ef' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;

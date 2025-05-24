import React, { FC, useEffect, useState } from "react";
import { TarefaService } from "../../services/api";
import TarefaForm from "../TarefaForm/TarefaForm";
import TarefaItem from "../TarefaItem/TarefaItem";
import Tarefa from "../../types/Tarefa";

interface TarefaPageProps {
  selectedDate: Date;
  onClose: () => void;
}

const TarefaPage: FC<TarefaPageProps> = ({ selectedDate, onClose }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregarTarefas = async () => {
    try {
      setCarregando(true);
      const tarefasCarregadas = await TarefaService.listarTarefas();
      setTarefas(tarefasCarregadas);
      setErro(null);
    } catch (error) {
      console.error("Erro ao carregar tarefas:", error);
      setErro(
        "Não foi possível carregar as tarefas. Tente novamente mais tarde."
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  const handleTarefaAdicionada = () => {
    carregarTarefas();
  };

  const handleTarefaAtualizada = () => {
    carregarTarefas();
  };

  return (
    <div
      className="h-full w-full overflow-y-auto custom-scrollbar"
      style={{
        scrollBehavior: 'smooth',
        scrollbarWidth: 'thin',
        scrollbarColor: '#1E40AF #1E293B'
      }}
    >
      <style>
        {`
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #1E293B;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #3B82F6;
            border-radius: 3px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #2563EB;
          }
        `}
      </style>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-blue-400">
          Tarefas para {selectedDate.toLocaleDateString('pt-BR')}
        </h1>
        <button 
          onClick={onClose}
          className="text-blue-200 hover:text-blue-400 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Formulário de tarefa */}
      <div className="bg-[#1E293B] border border-blue-800 rounded-xl shadow-lg p-4 mb-4">
        <h2 className="text-lg font-semibold mb-3 text-[#F8FAFC]">
          Adicionar Nova Tarefa
        </h2>
        <TarefaForm onTarefaAdicionada={handleTarefaAdicionada} />
      </div>

      {/* Lista de tarefas */}
      <div className="bg-[#1E293B] border border-blue-800 rounded-xl shadow-lg p-4">
        <h2 className="text-lg font-semibold mb-3 text-[#F8FAFC]">
          Minhas Tarefas
        </h2>

        {carregando ? (
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400"></div>
            <p className="mt-2 text-blue-300">Carregando tarefas...</p>
          </div>
        ) : erro ? (
          <div className="bg-red-900/30 border border-red-700 text-red-400 px-3 py-2 rounded-lg">
            {erro}
          </div>
        ) : tarefas.length === 0 ? (
          <div className="text-center py-4 text-blue-400">
            <p>Nenhuma tarefa encontrada. Adicione uma nova tarefa acima.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tarefas.map((tarefa) => (
              <TarefaItem
                key={tarefa.id}
                tarefa={tarefa}
                onTarefaAtualizada={handleTarefaAtualizada}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TarefaPage;

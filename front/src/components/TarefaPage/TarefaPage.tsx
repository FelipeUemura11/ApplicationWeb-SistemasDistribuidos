import React, { FC, useEffect, useState } from "react";
import * as taskService from "../../services/taskService";
import TarefaForm from "../TarefaForm/TarefaForm";
import TarefaItem from "../TarefaItem/TarefaItem";
import { Task as Tarefa } from "../../services/taskService";
import { useAuth } from "../../context/authContext";

interface TarefaPageProps {
  selectedDate: Date;
  onClose: () => void;
}

const TarefaPage: FC<TarefaPageProps> = ({ selectedDate, onClose }) => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [carregando, setCarregando] = useState<boolean>(true);
  const [erro, setErro] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser?.uid) {
      setCarregando(false);
      setTarefas([]);
      return;
    }

    setErro(null);

    const unsubscribe = taskService.listenToUserTasks(
      currentUser.uid,
      selectedDate,
      (tarefasCarregadas) => {
        setTarefas(tarefasCarregadas);
      },
      (error) => {
        console.error("Erro ao carregar tarefas:", error);
        setErro(error.message || "Não foi possível carregar as tarefas.");
        setCarregando(false);
      },
      (loadingState) => {
        setCarregando(loadingState);
      }
    );

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [currentUser?.uid, selectedDate]);

  const handleTarefaAdicionadaOuAtualizada = () => {
    console.log("Tarefa foi adicionada/atualizada. O listener deve atualizar a lista.");
  };

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar pr-2">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-blue-300">
          Tarefas para {selectedDate.toLocaleDateString("pt-BR", { weekday: 'long', day: 'numeric', month: 'long' })}
        </h1>
        <button
          onClick={onClose}
          className="text-blue-400 hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-slate-700"
          title="Fechar"
        >
          ✕
        </button>
      </div>

      <div className="bg-[#172033] border border-blue-700/50 rounded-xl shadow-lg p-4 mb-6">
        <h2 className="text-lg font-medium mb-3 text-slate-100">
          Adicionar Nova Tarefa
        </h2>
        <TarefaForm 
            onTarefaAdicionada={handleTarefaAdicionadaOuAtualizada} 
            selectedDate={selectedDate}
        />
      </div>

      <div className="bg-[#172033] border border-blue-700/50 rounded-xl shadow-lg p-4">
        <h2 className="text-lg font-medium mb-3 text-slate-100">
          Minhas Tarefas ({tarefas.length})
        </h2>
        {carregando && tarefas.length === 0 ? (
          <div className="text-center py-4 text-blue-400">
            <div className="inline-block animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-400 mb-2"></div>
            <p>Carregando tarefas...</p>
          </div>
        ) : erro ? (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-3 py-2 rounded-lg text-sm">
            {erro}
          </div>
        ) : tarefas.length === 0 ? (
          <div className="text-center py-4 text-blue-400">
            <p>Nenhuma tarefa encontrada para esta data.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tarefas.map((tarefa) => (
              <TarefaItem
                key={tarefa.id}
                tarefa={tarefa}
                onTarefaAtualizada={handleTarefaAdicionadaOuAtualizada}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TarefaPage;
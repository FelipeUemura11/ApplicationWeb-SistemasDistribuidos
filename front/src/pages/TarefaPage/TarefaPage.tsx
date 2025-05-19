import React, { FC, useEffect, useState } from "react";
import { TarefaService } from "../../services/api";
import TarefaForm from "../TarefaForm/TarefaForm";
import TarefaItem from "../TarefaItem/TarefaItem";
import Tarefa from "../../types/Tarefa";

const TarefaPage: FC = () => {
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
    <section className="min-h-screen pt-32 pb-16 bg-gradient-to-br from-[#0F172A] to-[#1E293B] px-4">
      <div className="max-w-4xl mx-auto text-blue-100">
        <h1 className="text-4xl font-bold text-blue-400 mb-10 text-center">
          Gerenciador de Tarefas
        </h1>

        {/* Formulário de tarefa */}
        <div className="bg-[#1E293B] border border-blue-800 rounded-2xl shadow-lg p-6 mb-10">
          <h2 className="text-xl font-semibold mb-4 text-[#F8FAFC]">
            Adicionar Nova Tarefa
          </h2>
          <TarefaForm onTarefaAdicionada={handleTarefaAdicionada} />
        </div>

        {/* Lista de tarefas */}
        <div className="bg-[#1E293B] border border-blue-800 rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-[#F8FAFC]">
            Minhas Tarefas
          </h2>

          {carregando ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400"></div>
              <p className="mt-2 text-blue-300">Carregando tarefas...</p>
            </div>
          ) : erro ? (
            <div className="bg-red-900/30 border border-red-700 text-red-400 px-4 py-3 rounded-lg">
              {erro}
            </div>
          ) : tarefas.length === 0 ? (
            <div className="text-center py-8 text-blue-400">
              <p>Nenhuma tarefa encontrada. Adicione uma nova tarefa acima.</p>
            </div>
          ) : (
            <div className="space-y-4">
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
    </section>
  );
};

export default TarefaPage;

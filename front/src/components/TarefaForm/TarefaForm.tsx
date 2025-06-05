import React, { useState } from 'react';
import * as taskService from '../../services/taskService';
import { useAuth } from '../../context/authContext';

interface TarefaFormProps {
  onTarefaAdicionada: () => void;
  selectedDate: Date;
}

const TarefaForm: React.FC<TarefaFormProps> = ({ onTarefaAdicionada, selectedDate }) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { currentUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setErro("Você precisa estar logado para criar tarefas.");
      return;
    }
    if (!selectedDate) {
        setErro("Data alvo não selecionada. Por favor, selecione uma data no calendário.");
        return;
    }
    if (!titulo.trim()) {
      setErro('O título é obrigatório');
      return;
    }
    setErro(null);
    setIsSubmitting(true);

    try {
      await taskService.createTask(
        { 
          title: titulo.trim(), 
          description: descricao.trim(),
          targetDate: selectedDate
        }, 
        currentUser
      );
      setTitulo('');
      setDescricao('');
      onTarefaAdicionada();
    } catch (error) {
      console.error('Erro ao criar tarefa:', error);
      setErro(error instanceof Error ? error.message : 'Erro ao criar tarefa. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="task-title" className="block text-sm font-medium text-[#F8FAFC]">Título</label>
        <input
          id="task-title"
          type="text"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#0F172A] border-blue-700 text-blue-100 shadow-sm outline-none p-2 focus:ring-blue-500 focus:border-blue-500"
          required
          disabled={isSubmitting}
        />
      </div>
      <div>
        <label htmlFor="task-description" className="block text-sm font-medium text-[#F8FAFC]">Descrição</label>
        <textarea
          id="task-description"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="mt-1 block w-full rounded-md bg-[#0F172A] border-blue-700 text-blue-100 shadow-sm outline-none p-2 focus:ring-blue-500 focus:border-blue-500"
          rows={3}
          disabled={isSubmitting}
        />
      </div>
      {erro && (
        <div className="text-red-400 text-sm p-2 bg-red-900/30 border border-red-700 rounded">
          {erro}
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white hover:bg-blue-700 transition cursor-pointer py-2 px-4 rounded-md focus:outline-none disabled:opacity-50"
      >
        {isSubmitting ? 'Adicionando...' : 'Adicionar Tarefa'}
      </button>
    </form>
  );
};

export default TarefaForm;
import React, { useState } from 'react';
import { TarefaService } from '../../services/api';
import Tarefa from '../../types/Tarefa';

interface TarefaFormProps {
    onTarefaAdicionada: () => void;
}

const TarefaForm: React.FC<TarefaFormProps> = ({ onTarefaAdicionada }) => {
    const [titulo, setTitulo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [erro, setErro] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(null);
        
        if (!titulo.trim()) {
            setErro('O título é obrigatório');
            return;
        }

        try {
            const novaTarefa: Omit<Tarefa, 'id'> = {
                titulo: titulo.trim(),
                descricao: descricao.trim(),
                status: false,
                dataCriacao: new Date(),
                dataConclusao: null
            };
            
            await TarefaService.criarTarefa(novaTarefa);
            setTitulo('');
            setDescricao('');
            onTarefaAdicionada();
        } catch (error) {
            console.error('Erro ao criar tarefa:', error);
            setErro('Erro ao criar tarefa. Tente novamente.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-[#F8FAFC]">Título</label>
                <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
                    required
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-[#F8FAFC]">Descrição</label>
                <textarea
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm outline-none"
                    rows={3}
                />
            </div>
            {erro && (
                <div className="text-red-600 text-sm">
                    {erro}
                </div>
            )}
            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
                Adicionar Tarefa
            </button>
        </form>
    );
};

export default TarefaForm;
import React, { useState } from 'react';
import Tarefa from '../../types/Tarefa';
import { TarefaService } from '../../services/api';

interface TarefaItemProps {
    tarefa: Tarefa;
    onTarefaAtualizada: () => void;
}

const TarefaItem: React.FC<TarefaItemProps> = ({ tarefa, onTarefaAtualizada }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [titulo, setTitulo] = useState(tarefa.titulo);
    const [descricao, setDescricao] = useState(tarefa.descricao);
    const [loading, setLoading] = useState(false);

    const handleToggleStatus = async () => {
        try{
            if (tarefa.status) return;
            await TarefaService.atualizarTarefa(tarefa.id, {
                status: true,
                dataConclusao: new Date()
            });
            onTarefaAtualizada();
        }catch(error){
            console.error('Erro ao atualizar status da tarefa:', error);
        }
    };

    const handleDelete = async () => {
        try{
            await TarefaService.deletarTarefa(tarefa.id);
            onTarefaAtualizada();
        }catch(error){
            console.error('Erro ao deletar tarefa:', error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setTitulo(tarefa.titulo);
        setDescricao(tarefa.descricao);
    };

    const handleSaveEdit = async () => {
        setLoading(true);
        try {
            await TarefaService.atualizarTarefa(tarefa.id, {
                titulo,
                descricao
            });
            setIsEditing(false);
            onTarefaAtualizada();
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${tarefa.status ? 'bg-[#1E293B]' : 'bg-[#1E293B]'} mb-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <input
                        type="checkbox"
                        checked={tarefa.status}
                        onChange={handleToggleStatus}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={titulo}
                                    onChange={e => setTitulo(e.target.value)}
                                    className="block w-full rounded-md border border-blue-800 bg-[#0F172A] text-blue-100 px-2 py-1 mb-2"
                                    disabled={loading}
                                />
                                <textarea
                                    value={descricao}
                                    onChange={e => setDescricao(e.target.value)}
                                    className="block w-full rounded-md border border-blue-800 bg-[#0F172A] text-blue-100 px-2 py-1 mb-2"
                                    rows={2}
                                    disabled={loading}
                                />
                                <div className="flex gap-2 mt-1">
                                    <button
                                        onClick={handleSaveEdit}
                                        className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        disabled={loading}
                                    >Salvar</button>
                                    <button
                                        onClick={handleCancelEdit}
                                        className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
                                        disabled={loading}
                                    >Cancelar</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h3 className={`text-lg font-medium ${tarefa.status ? 'line-through text-gray-500' : 'text-gray-100'}`}>
                                    {tarefa.titulo}
                                </h3>
                                <p className={`text-sm ${tarefa.status ? 'text-gray-400' : 'text-gray-300'}`}>
                                    {tarefa.descricao}
                                </p>
                            </>
                        )}
                    </div>
                </div>
                <div className="flex gap-2 items-center">
                    <button
                        onClick={handleEdit}
                        className="text-blue-400 hover:text-blue-600 transition-colors p-2"
                        title="Editar tarefa"
                        disabled={isEditing}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        </svg>
                    </button>
                    { !isEditing && (
                        <button
                            onClick={handleDelete}
                            className="text-red-600 hover:text-red-800 transition-colors p-2"
                            title="Deletar tarefa"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TarefaItem;
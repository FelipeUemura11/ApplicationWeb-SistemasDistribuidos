import React, { useState } from 'react';
import { Task } from '../../services/taskService';
import * as taskService from '../../services/taskService';
import { FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import Swal from 'sweetalert2';

interface TarefaItemProps {
    tarefa: Task;
    onTarefaAtualizada: () => void;
}

const TarefaItem: React.FC<TarefaItemProps> = ({ tarefa, onTarefaAtualizada }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tituloEdit, setTituloEdit] = useState(tarefa.title);
    const [descricaoEdit, setDescricaoEdit] = useState(tarefa.description);
    const [loading, setLoading] = useState(false);

    const handleToggleStatus = async () => {
        setLoading(true);
        try {
            await taskService.updateTask(tarefa.id, {
                status: !tarefa.status,
            });
        } catch (error) {
            console.error('Erro ao atualizar status da tarefa:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: 'Confirmar Exclusão',
            text: `Você tem certeza que deseja excluir a tarefa "${tarefa.title}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            cancelButtonText: 'Cancelar',
            background: '#1E293B',
            color: '#E0E7FF',
            confirmButtonColor: '#EF4444',
            cancelButtonColor: '#6B7280',
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await taskService.deleteTask(tarefa.id);
            } catch (error) {
                console.error('Erro ao deletar tarefa:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erro!',
                    text: error instanceof Error ? error.message : 'Não foi possível deletar a tarefa.',
                    background: '#1E293B',
                    color: '#E0E7FF'
                });
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = () => {
        setTituloEdit(tarefa.title);
        setDescricaoEdit(tarefa.description);
        setIsEditing(true);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
    };

    const handleSaveEdit = async () => {
        if (!tituloEdit.trim()) {
            Swal.fire('Erro', 'O título não pode ficar vazio.', 'error');
            return;
        }
        setLoading(true);
        try {
            await taskService.updateTask(tarefa.id, {
                title: tituloEdit.trim(),
                description: descricaoEdit.trim(),
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Erro ao editar tarefa:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`p-4 rounded-lg border ${tarefa.status ? 'bg-slate-700/50 border-slate-600' : 'bg-[#172033] border-blue-700/50'} mb-2 shadow-md`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        checked={tarefa.status}
                        onChange={handleToggleStatus}
                        disabled={loading}
                        className="h-5 w-5 mt-1 rounded border-slate-500 text-blue-500 focus:ring-blue-500 bg-slate-700 cursor-pointer"
                    />
                    <div className="flex-grow">
                        {isEditing ? (
                            <div className="space-y-2">
                                <input
                                    type="text"
                                    value={tituloEdit}
                                    onChange={e => setTituloEdit(e.target.value)}
                                    className="block w-full rounded-md border border-blue-700 bg-[#0F172A] text-blue-100 px-2 py-1 text-base"
                                    disabled={loading}
                                />
                                <textarea
                                    value={descricaoEdit}
                                    onChange={e => setDescricaoEdit(e.target.value)}
                                    className="block w-full rounded-md border border-blue-700 bg-[#0F172A] text-blue-100 px-2 py-1 text-sm"
                                    rows={2}
                                    disabled={loading}
                                />
                            </div>
                        ) : (
                            <>
                                <h3 className={`text-base font-medium ${tarefa.status ? 'line-through text-slate-500' : 'text-slate-100'}`}>
                                    {tarefa.title}
                                </h3>
                                {tarefa.description && (
                                    <p className={`text-sm ${tarefa.status ? 'text-slate-600' : 'text-slate-400'}`}>
                                        {tarefa.description}
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
                <div className={`flex flex-col md:flex-row gap-1 md:gap-2 items-center transition-opacity duration-300 ${isEditing ? 'opacity-0 pointer-events-none h-0' : 'opacity-100'}`}>
                    {!isEditing && (
                        <>
                            <button
                                onClick={handleEdit}
                                className="text-blue-400 hover:text-blue-200 transition-colors p-1 rounded-full hover:bg-slate-700"
                                title="Editar tarefa"
                            > <FaEdit size={16} /> </button>
                            <button
                                onClick={handleDelete}
                                className="text-red-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-slate-700"
                                title="Deletar tarefa"
                            > <FaTrash size={15} /> </button>
                        </>
                    )}
                </div>
            </div>
            {isEditing && (
                <div className="flex gap-2 mt-3 pt-3 border-t border-slate-700">
                    <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm font-medium flex items-center gap-1"
                        disabled={loading}
                    > <FaCheck /> Salvar</button>
                    <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-slate-600 text-slate-100 rounded hover:bg-slate-700 text-sm font-medium flex items-center gap-1"
                        disabled={loading}
                    > <FaTimes /> Cancelar</button>
                </div>
            )}
        </div>
    );
};

export default TarefaItem;
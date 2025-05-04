import React from 'react';
import Tarefa from '../../types/Tarefa';
import { TarefaService } from '../../services/api';

interface TarefaItemProps {
    tarefa: Tarefa;
    onTarefaAtualizada: () => void;
}

const TarefaItem: React.FC<TarefaItemProps> = ({ tarefa, onTarefaAtualizada }) => {
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

    return (
        <div className={`p-4 rounded-lg border ${tarefa.status ? 'bg-gray-50' : 'bg-white'} mb-4`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <input
                        type="checkbox"
                        checked={tarefa.status}
                        onChange={handleToggleStatus}
                        className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div>
                        <h3 className={`text-lg font-medium ${tarefa.status ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                            {tarefa.titulo}
                        </h3>
                        <p className={`text-sm ${tarefa.status ? 'text-gray-400' : 'text-gray-600'}`}>
                            {tarefa.descricao}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDelete}
                    className="text-red-600 hover:text-red-800 transition-colors"
                >
                </button>
            </div>
        </div>
    );
};

export default TarefaItem;
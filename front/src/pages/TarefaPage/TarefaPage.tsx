import React, { FC, useEffect, useState } from 'react';
import { TarefaService } from '../../services/api';
import TarefaForm from '../TarefaForm/TarefaForm';
import TarefaItem from '../TarefaItem/TarefaItem';
import Tarefa from '../../types/Tarefa';

const TarefaPage: FC = () => {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [carregando, setCarregando] = useState<boolean>(true)
  const [erro, setErro] = useState<string | null>(null)

  // Função para carregar as tarefas do backend
  const carregarTarefas = async () => {
    try {
      setCarregando(true)
      const tarefasCarregadas = await TarefaService.listarTarefas()
      setTarefas(tarefasCarregadas)
      setErro(null)
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error)
      setErro('Não foi possível carregar as tarefas. Tente novamente mais tarde.')
    } finally {
      setCarregando(false)
    }
  }

  // Carregar tarefas quando o componente for montado
  useEffect(() => {
    carregarTarefas()
  }, [])

  // Função para lidar com a adição de uma nova tarefa
  const handleTarefaAdicionada = () => {
    carregarTarefas()
  }

  // Função para lidar com a atualização de uma tarefa
  const handleTarefaAtualizada = () => {
    carregarTarefas()
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          Gerenciador de Tarefas
        </h1>

        {/* Formulário para adicionar novas tarefas */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Adicionar Nova Tarefa</h2>
          <TarefaForm onTarefaAdicionada={handleTarefaAdicionada} />
        </div>

        {/* Lista de tarefas */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Minhas Tarefas</h2>
          
          {carregando ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Carregando tarefas...</p>
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {erro}
            </div>
          ) : tarefas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
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
    </div>
  )
}

export default TarefaPage;
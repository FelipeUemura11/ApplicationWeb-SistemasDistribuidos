import axios from 'axios';
import Tarefa from '../types/Tarefa';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

// Add a request interceptor to add the token to all requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear local storage and redirect to login
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login-register';
        }
        return Promise.reject(error);
    }
);

// Define objeto TarefaService para gereniar as requisições da API
export const TarefaService = {
    // Função para listar todas as tarefas
    async listarTarefas(): Promise<Tarefa[]> {
        const response = await api.get('/tarefa');
        return response.data.map((tarefa: any) => ({
            ...tarefa,
            dataCriacao: new Date(tarefa.dataCriacao),
            dataConclusao: tarefa.dataConclusao ? new Date(tarefa.dataConclusao) : null
        }));
    },
    // Função para criar uma nova tarefa
    async criarTarefa(tarefa: Omit<Tarefa, 'id'>): Promise<Tarefa> {
        const novaTarefa = {
            ...tarefa,
            dataCriacao: tarefa.dataCriacao.toISOString(),
            dataConclusao: tarefa.dataConclusao?.toISOString() || null
        };
        const response = await api.post('/tarefa', novaTarefa);
        return {
            ...response.data,
            dataCriacao: new Date(response.data.dataCriacao),
            dataConclusao: response.data.dataConclusao ? new Date(response.data.dataConclusao) : null
        };
    },
    // Função para atualizar uma tarefa
    async atualizarTarefa(id: string, tarefa: Partial<Tarefa>): Promise<Tarefa> {
        const tarefaAtualizada = {
            ...tarefa,
            dataCriacao: tarefa.dataCriacao?.toISOString(),
            dataConclusao: tarefa.dataConclusao?.toISOString() || null
        };
        const response = await api.put(`/tarefa/${id}`, tarefaAtualizada);
        return {
            ...response.data,
            dataCriacao: new Date(response.data.dataCriacao),
            dataConclusao: response.data.dataConclusao ? new Date(response.data.dataConclusao) : null
        };
    },
    // Função para deletar uma tarefa
    async deletarTarefa(id: string): Promise<void> {
        await api.delete(`/tarefa/${id}`);
    },
    // Função para buscar uma tarefa por ID
    async buscarTarefa(id: string): Promise<Tarefa> {
        const response = await api.get(`/tarefa/${id}`);
        return {
            ...response.data,
            dataCriacao: new Date(response.data.dataCriacao),
            dataConclusao: response.data.dataConclusao ? new Date(response.data.dataConclusao) : null
        };
    }
};

export default api;

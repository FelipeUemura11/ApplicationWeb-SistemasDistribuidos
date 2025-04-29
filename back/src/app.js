import express from 'express';
import cors from 'cors';
import TarefaRoutes from './routes/TarefaRoutes.js';

const app = express();
const PORT = process.env.PORT || 3777;

// Configuração do CORS para conexao com o frontend(5173)
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/tarefa', TarefaRoutes);

// Rotas de teste
app.get('/', (req, res) => {
    res.json({
        message: 'INICIANDO API DE TAREFAS'
    });
});

app.listen(PORT, () => {
    console.log(`Porta do servidor: ${PORT}`);
});

export default app;

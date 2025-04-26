import express from 'express';
import TarefaController from '../controllers/TarefasController.js';
import { ValidacaoTarefa } from '../middlewares/ValidacaoTarefa.js';

const router = express.Router();
// app.js utiliza /tarefa como prefixo dos endpoints
router.post('/adicionar', ValidacaoTarefa,TarefaController.criarTarefa);
router.get('/listar', TarefaController.listarTarefas);
router.get('/buscar/:id', TarefaController.buscarTarefa);
router.put('/atualizar/:id', TarefaController.atualizarTarefa);
router.delete('/deletar/:id', TarefaController.deletarTarefa);

export default router;

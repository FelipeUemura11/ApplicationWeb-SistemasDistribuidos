import express from 'express';
import TarefaController from '../controllers/TarefasController.js';
import { ValidacaoTarefa } from '../middlewares/ValidacaoTarefa.js';

const router = express.Router();
// app.js utiliza /tarefa como prefixo dos endpoints
router.post('/', ValidacaoTarefa,TarefaController.criarTarefa);
router.get('/', TarefaController.listarTarefas);
router.get('/:id', TarefaController.buscarTarefa);
router.put('/:id', TarefaController.atualizarTarefa);
router.delete('/:id', TarefaController.deletarTarefa);

export default router;

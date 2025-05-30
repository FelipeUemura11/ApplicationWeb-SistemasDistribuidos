import { Router } from 'express';
import UsuarioController from '../controllers/UsuaarioController.js';

const router = Router();

// Rotas públicas
router.post('/cadastrar', UsuarioController.cadastrarUsuario);
router.post('/login', UsuarioController.login);

// Rotas protegidas
router.get('/usuarios', UsuarioController.verificarToken, UsuarioController.listarUsuarios);
router.get('/usuario/:nome', UsuarioController.verificarToken, UsuarioController.buscarUsuario);
router.put('/usuario/:nome', UsuarioController.verificarToken, UsuarioController.atualizarUsuario);
router.delete('/usuario/:nome', UsuarioController.verificarToken, UsuarioController.deletarUsuario);

export default router; 
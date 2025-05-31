import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'src', 'data', 'usuarios.json');

class UsuarioController {
    constructor(){
        this.usuarios = [];
        this.carregarUsuarios();
        this.cadastrarUsuario = this.cadastrarUsuario.bind(this);
        this.listarUsuarios = this.listarUsuarios.bind(this);
        this.buscarUsuario = this.buscarUsuario.bind(this);
        this.atualizarUsuario = this.atualizarUsuario.bind(this);
        this.deletarUsuario = this.deletarUsuario.bind(this);
        this.login = this.login.bind(this);
    }

    async carregarUsuarios() {
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8');
            this.usuarios = JSON.parse(data);
        } catch (error) {
            // Se o arquivo não existir, cria um array vazio
            this.usuarios = [];
            await this.salvarUsuarios();
        }
    }

    async salvarUsuarios() {
        try {
            // Garante que o diretório existe
            await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
            await fs.writeFile(DB_PATH, JSON.stringify(this.usuarios, null, 2));
        } catch (error) {
            console.error('Erro ao salvar usuários:', error);
        }
    }

    async login(req, res) {
        try {
            const { email, senha } = req.body;

            if (!email || !senha) {
                return res.status(400).json({
                    error: 'Email e senha são obrigatórios'
                });
            }

            const usuario = this.usuarios.find(u => u.email === email);
            if (!usuario) {
                return res.status(401).json({
                    error: 'Usuário não encontrado'
                });
            }

            const senhaValida = await bcrypt.compare(senha, usuario.senha);
            if (!senhaValida) {
                return res.status(401).json({
                    error: 'Senha inválida'
                });
            }

            const token = jwt.sign(
                { 
                    id: usuario.id,
                    email: usuario.email 
                },
                process.env.JWT_SECRET || 'sua_chave_secreta',
                { expiresIn: '24h' }
            );

            return res.status(200).json({
                token,
                usuario: {
                    id: usuario.id,
                    nome: usuario.nome,
                    email: usuario.email
                }
            });

        } catch (error) {
            console.error('Erro ao fazer login:', error);
            res.status(500).json({
                message: 'Error: Falha ao fazer login'
            });
        }
    }

    async cadastrarUsuario(req, res){
        try{
            const {nome, email, senha} = req.body;

            if(!nome || !email || !senha){
                return res.status(400).json({
                    error: 'Nome, email e senha são obrigatórios'
                });
            }

            const emailExistente = this.usuarios.find(u => u.email === email);
            if(emailExistente) {
                return res.status(400).json({
                    error: 'Este email já está cadastrado'
                });
            }

            const senhaCriptografada = await bcrypt.hash(senha, 10);

            const novoUsuario = {
                id: Date.now(),
                nome,
                email,
                senha: senhaCriptografada
            };

            this.usuarios.push(novoUsuario);
            await this.salvarUsuarios();

            // Gera o token JWT após o cadastro
            const token = jwt.sign(
                { 
                    id: novoUsuario.id,
                    email: novoUsuario.email 
                },
                process.env.JWT_SECRET || 'sua_chave_secreta',
                { expiresIn: '24h' }
            );

            return res.status(201).json({
                token,
                usuario: {
                    id: novoUsuario.id,
                    nome: novoUsuario.nome,
                    email: novoUsuario.email
                }
            });

        }catch(error){
            console.error('Erro ao cadastrar usuário:', error);
            res.status(500).json({
                message: 'Error : Falha em cadastrar Usuario.'
            });
        }
    }

    async listarUsuarios(req, res){
        try{
            return res.status(200).json(this.usuarios);
        }catch(error){
            console.error('Erro ao listar usuários:', error);
            res.status(500).json({
                message: 'Error : Falha em listarUsuarios.'
            });
        }
    }

    async buscarUsuario(req, res){
        try{
            const {nome} = req.params;
            const usuarioIndex = this.usuarios.findIndex(u => u.nome === nome);
            if(usuarioIndex === -1){
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }
            return res.status(200).json(this.usuarios[usuarioIndex]);
        }catch(error){
            console.error('Erro ao buscar usuário:', error);
            res.status(500).json({
                message: 'Error : Falha em buscarUsuario.'
            });
        }
    }

    async atualizarUsuario(req, res){
        try{
            const {nome} = req.params;
            const {email, senha} = req.body;
            const usuarioIndex = this.usuarios.findIndex(u => u.nome === nome);

            if(usuarioIndex === -1){
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }

            const attUsuario = {
                ...this.usuarios[usuarioIndex],
                nome: nome || this.usuarios[usuarioIndex].nome,
                email: email || this.usuarios[usuarioIndex].email,
                senha: senha || this.usuarios[usuarioIndex].senha
            };

            this.usuarios[usuarioIndex] = attUsuario;
            await this.salvarUsuarios();
            return res.status(200).json(attUsuario);
        }catch(error){
            console.error('Erro ao atualizar usuário:', error);
            res.status(500).json({
                message: 'Error : Falha em atualizarUsuario.'
            });
        }
    }
    
    async deletarUsuario(req, res){
        try{
            const {nome} = req.params;
            const usuarioIndex = this.usuarios.findIndex(u => u.nome === nome);
            if(usuarioIndex === -1){
                return res.status(404).json({
                    error: 'Usuário não encontrado'
                });
            }
            this.usuarios.splice(usuarioIndex, 1);
            await this.salvarUsuarios();
            return res.status(200).json({
                message: 'Usuário deletado com sucesso'
            });
        }catch(error){
            console.error('Erro ao deletar usuário:', error);
            res.status(500).json({
                message: 'Error : Falha em deletarUsuario.'
            });
        }
    }

    // Middleware para verificar o token JWT
    verificarToken(req, res, next) {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                error: 'Token não fornecido'
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sua_chave_secreta');
            req.usuario = decoded;
            next();
        } catch (error) {
            return res.status(401).json({
                error: 'Token inválido'
            });
        }
    }
}

export default new UsuarioController();
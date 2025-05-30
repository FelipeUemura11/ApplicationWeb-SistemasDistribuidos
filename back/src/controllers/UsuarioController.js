import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class UsuarioController {
    constructor(){
        this.usuarios = [];
        this.cadastrarUsuario = this.cadastrarUsuario.bind(this);
        this.listarUsuarios = this.listarUsuarios.bind(this);
        this.buscarUsuario = this.buscarUsuario.bind(this);
        this.atualizarUsuario = this.atualizarUsuario.bind(this);
        this.deletarUsuario = this.deletarUsuario.bind(this);
        this.login = this.login.bind(this);
    }

    validarForcaSenha(senha) {
        const temMinimoCaracteres = senha.length >= 8;
        const temLetraMaiuscula = /[A-Z]/.test(senha);
        const temLetraMinuscula = /[a-z]/.test(senha);
        const temNumero = /[0-9]/.test(senha);
        const temCaractereEspecial = /[!@#$%^&*(),.?":{}|<>]/.test(senha);

        const erros = [];
        if (!temMinimoCaracteres) erros.push('A senha deve ter pelo menos 8 caracteres');
        if (!temLetraMaiuscula) erros.push('A senha deve conter pelo menos uma letra maiúscula');
        if (!temLetraMinuscula) erros.push('A senha deve conter pelo menos uma letra minúscula');
        if (!temNumero) erros.push('A senha deve conter pelo menos um número');
        if (!temCaractereEspecial) erros.push('A senha deve conter pelo menos um caractere especial');

        return {
            valida: erros.length === 0,
            erros
        };
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

            const validacaoSenha = this.validarForcaSenha(senha);
            if (!validacaoSenha.valida) {
                return res.status(400).json({
                    error: 'Senha inválida',
                    detalhes: validacaoSenha.erros
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
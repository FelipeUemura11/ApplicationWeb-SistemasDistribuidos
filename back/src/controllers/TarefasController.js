class TarefaController {
    constructor(){
        this.tarefas = [];
        this.criarTarefa = this.criarTarefa.bind(this);
        this.listarTarefas = this.listarTarefas.bind(this);
        this.buscarTarefa = this.buscarTarefa.bind(this);
        this.atualizarTarefa = this.atualizarTarefa.bind(this);
        this.deletarTarefa = this.deletarTarefa.bind(this);
    }

    // CRIAR TAREFAS
    async criarTarefa(req, res){
        try{
            const {titulo, descricao } = req.body;

            if(!titulo || !descricao){
                return res.status(400).json({
                    error: 'Título e descrição são obrigatórios'
                })
            }
            const novaTarefa = {
                id: Date.now().toString(),
                titulo,
                descricao,
                status: false,
                dataCriacao: new Date(),
                dataConclusao: null,
            };

            this.tarefas.push(novaTarefa);
            return res.status(201).json(novaTarefa);
        }catch(error){
            console.error('Erro ao criar tarefa:', error);
            res.status(500).json({
                message: 'Error : Falha em criarTarefa.'
            });
        }
    }
    // LISTAR TAREFAS
    async listarTarefas(req, res){
        try{
            return res.status(200).json(this.tarefas);
        }catch(error){
            console.error('Erro ao listar tarefas:', error);
            res.status(500).json({
                message: 'Error : Falha em listarTarefas.'
            });
        }
    }
    // BUSCAR TAREFAS
    async buscarTarefa(req, res){
        try{
            const { id } = req.params;
            const tarefaIndex = this.tarefas.findIndex(t => t.id === id);
            if(tarefaIndex === -1){
                return res.status(404).json({
                    error: 'Tarefa não encontrada'
                });
            }
            return res.status(200).json(this.tarefas[tarefaIndex]);
        }catch(error){
            console.error('Erro ao buscar tarefa:', error);
            res.status(500).json({
                message: 'Error : Falha em buscarTarefa.'
            });
        }
    }
    // ATUALIZAR TAREFAS
    async atualizarTarefa(req, res){
        try{
            const { id } = req.params;
            const { titulo, descricao, status } = req.body;
            const tarefaIndex = this.tarefas.findIndex(t => t.id === id);

            if(tarefaIndex === -1){
                return res.status(404).json({
                    error: 'Tarefa não encontrada'
                });
            }
            const attTarefa = {
                // spread operator, mantem com valores antigos os campos que nao foram atualizados
                ...this.tarefas[tarefaIndex],
                titulo: titulo || this.tarefas[tarefaIndex].titulo,
                descricao: descricao || this.tarefas[tarefaIndex].descricao,
                status: status || this.tarefas[tarefaIndex].status,
                dataConclusao: status ? new Date() : this.tarefas[tarefaIndex].dataConclusao // a conclusao depende do status
            };

            this.tarefas[tarefaIndex] = attTarefa;
            return res.status(200).json(attTarefa);
        }catch(error){
            console.error('Erro ao atualizar tarefa:', error);
            res.status(500).json({
                message: 'Error : Falha em atualizarTarefa.'
            });
        }
    }
    // DELETAR TAREFA
    async deletarTarefa(req, res){
        try{
            const { id } = req.params;
            const tarefaIndex = this.tarefas.findIndex(t => t.id === id);
            if(tarefaIndex === -1){
                return res.status(404).json({
                    error: 'Tarefa não encontrada'
                });
            }
            this.tarefas.splice(tarefaIndex, 1);
            return res.status(200).json({
                message: 'Tarefa deletada com sucesso'
            });
        }catch(error){
            console.error('Erro ao deletar tarefa:', error);
            res.status(500).json({
                message: 'Error : Falha em deletarTarefa.'
            });
        }
    }
}

export default new TarefaController();
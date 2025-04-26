export const ValidacaoTarefa = (req, res, next) => {
    const { titulo, descricao } = req.body;
    // verifica se os campos obrigatorios foram preenchidos
    if(!titulo || !descricao){
        return res.status(400).json({
            error: 'Todos os campos são obrigatórios'
        });
    }
    // minimo de caracteres para o titulo
    if(titulo.length < 3){
        return res.status(400).json({
            error: 'O título deve conter pelo menos 3 caracteres'
        });
    }
    next();
};
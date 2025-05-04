interface Tarefa {
  id: string;
  titulo: string;
  descricao: string;
  status: boolean;
  dataCriacao: Date;
  dataConclusao: Date | null;
};

export default Tarefa;

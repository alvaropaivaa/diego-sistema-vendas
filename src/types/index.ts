export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  dataNascimento: string;
  objetivo: string;
  status: 'ativo' | 'inativo';
  dataInicio: string;
  observacoes: string;
  foto?: string;
}

export interface Exercicio {
  id: string;
  nome: string;
  series: number;
  repeticoes: string;
  carga: string;
  descanso: string;
  observacoes: string;
}

export interface GrupoMuscular {
  id: string;
  nome: string;
  exercicios: Exercicio[];
}

export interface Treino {
  id: string;
  clienteId: string;
  nome: string;
  tipo: string;
  diasSemana: string[];
  grupos: GrupoMuscular[];
  dataCriacao: string;
  ativo: boolean;
}

export interface Alimento {
  id: string;
  nome: string;
  quantidade: string;
  calorias: string;
  proteinas: string;
  carboidratos: string;
  gorduras: string;
}

export interface Refeicao {
  id: string;
  nome: string;
  horario: string;
  alimentos: Alimento[];
}

export interface Dieta {
  id: string;
  clienteId: string;
  nome: string;
  objetivo: string;
  refeicoes: Refeicao[];
  dataCriacao: string;
  ativa: boolean;
  totalCalorias: string;
}

export interface Checkin {
  id: string;
  clienteId: string;
  data: string;
  status: 'pendente' | 'preenchida';
  
  // Respostas Anamnese Quinzenal
  adesaoTreino: number;
  adesaoDieta: number;
  adesaoSuplementacao: number;
  frequenciaTreino: string;
  faltouTreino: string; // Sim / Não
  evolucaoCarga: string; // Sim / Não
  intensidadeTreino: string; // Baixa / Média / Alta
  dificuldadeExercicios: string; // Sim / Não
  dorDesconforto: string; // Sim / Não
  nivelEnergia: string; // Baixa / Média / Alta
  nivelMotivacao: string; // Baixa / Média / Alta
  evolucaoFisica: string; // Sim / Não
  seguiuDieta: string; // Sim / Não
  furosDieta: string; // Sim / Não
  nivelFome: string; // Muita / Controlada / Pouca
  horasSono: string;
  qualidadeSono: string; // Ruim / Regular / Boa
  nivelEstresse: string; // Baixo / Médio / Alto
  usouSuplementacao: string; // Sim / Não
  efeitoColateral: string; // Sim / Não
  pesoAtual: string;
  objetivoPrincipal: string;
  nivelComprometimento: number;
  pontosMelhoria: string;
  satisfeitoTreino: string; // Sim / Não
  ajustesPrograma: string; // Sim / Não
}

export interface Mensagem {
  id: string;
  remetenteId: string;
  destinatarioId: string;
  conteudo: string;
  dataEnvio: string;
  lida: boolean;
  tipo: 'trainer' | 'aluno';
}

export interface Conversa {
  clienteId: string;
  clienteNome: string;
  mensagens: Mensagem[];
  ultimaMensagem: string;
}

export interface Anamnese {
  id: string;
  clienteId: string;
  data: string;
  status: 'pendente' | 'preenchida';
  objetivoPrincipal: string;
  tempoTreino: string;
  lesoes: string;
  doencas: string;
  medicamentos: string;
  alergiasAlimentares: string;
  cirurgias: string;
  frequenciaDesejada: string;
  nivelAtividade: string;
  fumante: boolean;
  bebidaAlcoolica: boolean;
  qualidadeSono: string;
  nivelEstresse: string;
  observacoes: string;
}

export interface Pagamento {
  id: string;
  clienteId: string;
  valor: number;
  dataVencimento: string;
  dataPagamento: string | null;
  status: 'pago' | 'pendente' | 'atrasado';
  mesReferencia: string;
  formaPagamento: string;
  observacoes: string;
}

export interface Configuracoes {
  nomeTrainer: string;
  metaMensal: number;
  valorMensalidade: number;
  horarioInicio: string;
  horarioFim: string;
  diasTrabalho: string[];
}

export interface AppState {
  clientes: Cliente[];
  treinos: Treino[];
  dietas: Dieta[];
  checkins: Checkin[];
  mensagens: Mensagem[];
  anamneses: Anamnese[];
  pagamentos: Pagamento[];
  configuracoes: Configuracoes;
}

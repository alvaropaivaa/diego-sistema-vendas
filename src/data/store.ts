import { supabase } from '../lib/supabase';
import type { Cliente, Treino, Dieta, Checkin, Mensagem, Anamnese, Pagamento, Configuracoes } from '../types';

// O estado inicial como fallback visual antes de inicializar o banco se falhar algo
const defaultConfig: Configuracoes = {
  nomeTrainer: 'Diego Haubricht',
  metaMensal: 50,
  valorMensalidade: 150,
  horarioInicio: '06:00',
  horarioFim: '22:00',
  diasTrabalho: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
};

// --- CLIENTES ---
export async function getClientes(): Promise<Cliente[]> {
  const { data, error } = await supabase.from('clientes').select('*');
  if (error) { console.error(error); return []; }
  return (data || []).map(parseCliente);
}

export async function getCliente(id: string): Promise<Cliente | undefined> {
  const { data, error } = await supabase.from('clientes').select('*').eq('id', id).single();
  if (error || !data) return undefined;
  return parseCliente(data);
}

export async function addCliente(cliente: Omit<Cliente, 'id'>): Promise<Cliente> {
  const { data, error } = await supabase.from('clientes').insert([unparseCliente(cliente as Cliente)]).select().single();
  if (error) throw error;
  return parseCliente(data);
}

export async function updateCliente(id: string, clienteData: Partial<Cliente>): Promise<Cliente | null> {
  const mapped = unparseCliente({ ...clienteData } as Cliente);
  delete mapped.id;
  const { data, error } = await supabase.from('clientes').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return parseCliente(data);
}

export async function deleteCliente(id: string): Promise<boolean> {
  const { error } = await supabase.from('clientes').delete().eq('id', id);
  return !error;
}

// --- TREINOS ---
export async function getTreinos(): Promise<Treino[]> {
  const { data, error } = await supabase.from('treinos').select('*');
  if (error) { console.error(error); return []; }
  return (data || []).map(parseTreino);
}

export async function getTreinosByCliente(clienteId: string): Promise<Treino[]> {
  const { data, error } = await supabase.from('treinos').select('*').eq('cliente_id', clienteId);
  if (error) return [];
  return (data || []).map(parseTreino);
}

export async function addTreino(treino: Omit<Treino, 'id'>): Promise<Treino> {
  const { data, error } = await supabase.from('treinos').insert([unparseTreino(treino as Treino)]).select().single();
  if (error) throw error;
  return parseTreino(data);
}

export async function updateTreino(id: string, treinoData: Partial<Treino>): Promise<Treino | null> {
  const mapped = unparseTreino({ ...treinoData } as Treino);
  delete mapped.id;
  const { data, error } = await supabase.from('treinos').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return parseTreino(data);
}

export async function deleteTreino(id: string): Promise<boolean> {
  const { error } = await supabase.from('treinos').delete().eq('id', id);
  return !error;
}

// --- DIETAS ---
export async function getDietas(): Promise<Dieta[]> {
  const { data, error } = await supabase.from('dietas').select('*');
  if (error) return [];
  return (data || []).map(parseDieta);
}

export async function getDietasByCliente(clienteId: string): Promise<Dieta[]> {
  const { data, error } = await supabase.from('dietas').select('*').eq('cliente_id', clienteId);
  if (error) return [];
  return (data || []).map(parseDieta);
}

export async function addDieta(dieta: Omit<Dieta, 'id'>): Promise<Dieta> {
  const { data, error } = await supabase.from('dietas').insert([unparseDieta(dieta as Dieta)]).select().single();
  if (error) throw error;
  return parseDieta(data);
}

export async function updateDieta(id: string, dietaData: Partial<Dieta>): Promise<Dieta | null> {
  const mapped = unparseDieta({ ...dietaData } as Dieta);
  delete mapped.id;
  const { data, error } = await supabase.from('dietas').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return parseDieta(data);
}

export async function deleteDieta(id: string): Promise<boolean> {
  const { error } = await supabase.from('dietas').delete().eq('id', id);
  return !error;
}

// --- CHECKINS ---
export async function getCheckins(): Promise<Checkin[]> {
  const { data, error } = await supabase.from('checkins').select('*');
  if (error) return [];
  return (data || []).map(parseCheckin);
}

export async function getCheckinsByCliente(clienteId: string): Promise<Checkin[]> {
  const { data, error } = await supabase.from('checkins').select('*').eq('cliente_id', clienteId);
  if (error) return [];
  return (data || []).map(parseCheckin);
}

export async function addCheckin(checkin: Omit<Checkin, 'id'>): Promise<Checkin> {
  const { data, error } = await supabase.from('checkins').insert([unparseCheckin(checkin as Checkin)]).select().single();
  if (error) throw error;
  return parseCheckin(data);
}

export async function deleteCheckin(id: string): Promise<boolean> {
  const { error } = await supabase.from('checkins').delete().eq('id', id);
  return !error;
}

// --- MENSAGENS ---
export async function getMensagens(): Promise<Mensagem[]> {
  const { data, error } = await supabase.from('mensagens').select('*');
  if (error) return [];
  return (data || []).map(parseMensagem);
}

export async function getMensagensByCliente(clienteId: string): Promise<Mensagem[]> {
  const { data, error } = await supabase.from('mensagens').select('*')
    .or(`remetente_id.eq.${clienteId},destinatario_id.eq.${clienteId}`);
  if (error) return [];
  return (data || []).map(parseMensagem);
}

export async function addMensagem(msg: Omit<Mensagem, 'id'>): Promise<Mensagem> {
  const { data, error } = await supabase.from('mensagens').insert([{
    remetente_id: msg.remetenteId,
    destinatario_id: msg.destinatarioId,
    conteudo: msg.conteudo,
    tipo: msg.tipo,
    lida: msg.lida,
    data_envio: msg.dataEnvio
  }]).select().single();
  if (error) throw error;
  return parseMensagem(data);
}

export async function markMensagemLida(id: string): Promise<void> {
  await supabase.from('mensagens').update({ lida: true }).eq('id', id);
}

export async function getMensagensInfo(userId: string, _tipo: 'trainer' | 'aluno') {
  const { count } = await supabase.from('mensagens').select('*', { count: 'exact', head: true })
    .eq('destinatario_id', userId).eq('lida', false);
  return { unread: count || 0 };
}

// --- ANAMNESES ---
export async function getAnamneses(): Promise<Anamnese[]> {
  const { data, error } = await supabase.from('anamneses').select('*');
  if (error) return [];
  return (data || []).map(parseAnamnese);
}

export async function getAnamneseByCliente(clienteId: string): Promise<Anamnese | undefined> {
  const { data, error } = await supabase.from('anamneses').select('*').eq('cliente_id', clienteId).single();
  if (error || !data) return undefined;
  return parseAnamnese(data);
}

export async function addAnamnese(anamnese: Omit<Anamnese, 'id'>): Promise<Anamnese> {
  const { data, error } = await supabase.from('anamneses').insert([unparseAnamnese(anamnese as Anamnese)]).select().single();
  if (error) throw error;
  return parseAnamnese(data);
}

export async function updateAnamnese(id: string, anamneseData: Partial<Anamnese>): Promise<Anamnese | null> {
  const mapped = unparseAnamnese({ ...anamneseData } as Anamnese);
  delete mapped.id;
  const { data, error } = await supabase.from('anamneses').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return parseAnamnese(data);
}

// --- PAGAMENTOS ---
export async function getPagamentos(): Promise<Pagamento[]> {
  const { data, error } = await supabase.from('pagamentos').select('*');
  if (error) return [];
  return (data || []).map(parsePagamento);
}

export async function getPagamentosByCliente(clienteId: string): Promise<Pagamento[]> {
  const { data, error } = await supabase.from('pagamentos').select('*').eq('cliente_id', clienteId);
  if (error) return [];
  return (data || []).map(parsePagamento);
}

export async function addPagamento(pagamento: Omit<Pagamento, 'id'>): Promise<Pagamento> {
  const { data, error } = await supabase.from('pagamentos').insert([unparsePagamento(pagamento as Pagamento)]).select().single();
  if (error) throw error;
  return parsePagamento(data);
}

export async function updatePagamento(id: string, reqData: Partial<Pagamento>): Promise<Pagamento | null> {
  const mapped = unparsePagamento({ ...reqData } as Pagamento);
  delete mapped.id;
  const { data, error } = await supabase.from('pagamentos').update(mapped).eq('id', id).select().single();
  if (error || !data) return null;
  return parsePagamento(data);
}

export async function deletePagamento(id: string): Promise<boolean> {
  const { error } = await supabase.from('pagamentos').delete().eq('id', id);
  return !error;
}

// --- CONFIGURACOES ---
export async function getConfig(): Promise<Configuracoes> {
  const { data, error } = await supabase.from('configuracoes').select('*').limit(1).single();
  if (error || !data) return defaultConfig;
  return {
    nomeTrainer: data.nome_trainer,
    metaMensal: data.meta_mensal,
    valorMensalidade: Number(data.valor_mensalidade),
    horarioInicio: data.horario_inicio,
    horarioFim: data.horario_fim,
    diasTrabalho: data.dias_trabalho || [],
  };
}

export async function updateConfig(config: Partial<Configuracoes>): Promise<Configuracoes> {
  const mapped: any = {};
  if (config.nomeTrainer) mapped.nome_trainer = config.nomeTrainer;
  if (config.metaMensal) mapped.meta_mensal = config.metaMensal;
  if (config.valorMensalidade) mapped.valor_mensalidade = config.valorMensalidade;
  if (config.horarioInicio) mapped.horario_inicio = config.horarioInicio;
  if (config.horarioFim) mapped.horario_fim = config.horarioFim;
  if (config.diasTrabalho) mapped.dias_trabalho = config.diasTrabalho;
  
  const current = await getConfig(); // Supabase id not strictly needed if we just update everything where id is not null etc.
  // Actually, we should just update row 1.
  const { data, error } = await supabase.from('configuracoes').select('id').limit(1).single();
  if (data?.id && !error) {
     await supabase.from('configuracoes').update(mapped).eq('id', data.id);
  }
  return { ...current, ...config };
}

// === UTILS ===
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// ==== PARSERS (SNAKE_CASE TO CAMEL_CASE) ====
function parseCliente(raw: any): Cliente {
  return {
    id: raw.id,
    nome: raw.nome,
    email: raw.email,
    telefone: raw.telefone,
    dataNascimento: raw.data_nascimento,
    objetivo: raw.objetivo,
    status: raw.status,
    dataInicio: raw.data_inicio,
    observacoes: raw.observacoes,
    foto: raw.foto || ''
  };
}
function unparseCliente(c: Cliente): any {
  return {
    id: c.id, nome: c.nome, email: c.email, telefone: c.telefone,
    data_nascimento: c.dataNascimento, objetivo: c.objetivo, status: c.status,
    data_inicio: c.dataInicio, observacoes: c.observacoes, foto: c.foto
  };
}

function parseTreino(raw: any): Treino {
  return {
    id: raw.id, clienteId: raw.cliente_id, nome: raw.nome, tipo: raw.tipo,
    diasSemana: raw.dias_semana || [], grupos: raw.grupos || [],
    dataCriacao: raw.data_criacao, ativo: raw.ativo
  };
}
function unparseTreino(t: Treino): any {
  return {
    id: t.id, cliente_id: t.clienteId, nome: t.nome, tipo: t.tipo,
    dias_semana: t.diasSemana, grupos: t.grupos, data_criacao: t.dataCriacao, ativo: t.ativo
  };
}

function parseDieta(raw: any): Dieta {
  return {
    id: raw.id, clienteId: raw.cliente_id, nome: raw.nome, objetivo: raw.objetivo,
    refeicoes: raw.refeicoes || [], dataCriacao: raw.data_criacao,
    ativa: raw.ativa, totalCalorias: raw.total_calorias
  };
}
function unparseDieta(d: Dieta): any {
  return {
    id: d.id, cliente_id: d.clienteId, nome: d.nome, objetivo: d.objetivo,
    refeicoes: d.refeicoes, data_criacao: d.dataCriacao, ativa: d.ativa, total_calorias: d.totalCalorias
  };
}

function parseCheckin(raw: any): Checkin {
  return {
    id: raw.id, clienteId: raw.cliente_id, data: raw.data, status: raw.status,
    ...raw.respostas
  };
}
function unparseCheckin(c: Checkin): any {
  const { id, clienteId, data, status, ...respostas } = c;
  return { id, cliente_id: clienteId, data, status, respostas };
}

function parseMensagem(raw: any): Mensagem {
  return {
    id: raw.id, remetenteId: raw.remetente_id, destinatarioId: raw.destinatario_id,
    conteudo: raw.conteudo, dataEnvio: raw.data_envio, lida: raw.lida, tipo: raw.tipo
  };
}

function parseAnamnese(raw: any): Anamnese {
  return {
    id: raw.id, clienteId: raw.cliente_id, data: raw.data, status: raw.status,
    ...raw.respostas
  };
}
function unparseAnamnese(from: Anamnese): any {
  const { id, clienteId, data, status, ...respostas } = from;
  return { id, cliente_id: clienteId, data, status, respostas };
}

function parsePagamento(raw: any): Pagamento {
  return {
    id: raw.id, clienteId: raw.cliente_id, valor: Number(raw.valor),
    dataVencimento: raw.data_vencimento, dataPagamento: raw.data_pagamento,
    status: raw.status, mesReferencia: raw.mes_referencia,
    formaPagamento: raw.forma_pagamento, observacoes: raw.observacoes
  };
}
function unparsePagamento(p: Pagamento): any {
  return {
    id: p.id, cliente_id: p.clienteId, valor: p.valor, data_vencimento: p.dataVencimento,
    data_pagamento: p.dataPagamento, status: p.status, mes_referencia: p.mesReferencia,
    forma_pagamento: p.formaPagamento, observacoes: p.observacoes
  };
}

import { useState, useEffect } from 'react';
import type { Cliente, Treino, Dieta, Checkin, Mensagem, Anamnese, Pagamento, Configuracoes } from '../types';
import * as db from '../data/store'; // we will rename the async file to what we have or just mock it. Wait, if store is rewritten to be async, we import it from store.

export function useClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await db.getClientes();
    setClientes(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  return { clientes, loading, refetch: fetch };
}

export function useTreinos(clienteId?: string) {
  const [treinos, setTreinos] = useState<Treino[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? await db.getTreinosByCliente(clienteId) : await db.getTreinos();
    setTreinos(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { treinos, setTreinos, loading, refetch: fetch };
}

export function useDietas(clienteId?: string) {
  const [dietas, setDietas] = useState<Dieta[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? await db.getDietasByCliente(clienteId) : await db.getDietas();
    setDietas(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { dietas, loading, setDietas, refetch: fetch };
}

export function useCheckins(clienteId?: string) {
  const [checkins, setCheckins] = useState<Checkin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? await db.getCheckinsByCliente(clienteId) : await db.getCheckins();
    setCheckins(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { checkins, loading, setCheckins, refetch: fetch };
}

export function useMensagens(clienteId?: string) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? await db.getMensagensByCliente(clienteId) : await db.getMensagens();
    setMensagens(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { mensagens, loading, setMensagens, refetch: fetch };
}

export function useAnamneses(clienteId?: string) {
  const [anamneses, setAnamneses] = useState<Anamnese[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? [(await db.getAnamneseByCliente(clienteId)) as Anamnese].filter(Boolean) : await db.getAnamneses();
    setAnamneses(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { anamneses, loading, setAnamneses, refetch: fetch };
}

export function usePagamentos(clienteId?: string) {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = clienteId ? await db.getPagamentosByCliente(clienteId) : await db.getPagamentos();
    setPagamentos(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, [clienteId]);
  return { pagamentos, loading, setPagamentos, refetch: fetch };
}

export function useConfiguracoes() {
  const [config, setConfig] = useState<Configuracoes | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = async () => {
    setLoading(true);
    const data = await db.getConfig();
    setConfig(data);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);
  return { config, loading, refetch: fetch };
}

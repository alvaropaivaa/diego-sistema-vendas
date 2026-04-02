import { useState } from 'react';
import { addMensagem, markMensagemLida } from '../../data/store';
import { useClientes, useMensagens } from '../../hooks/useData';
import type { Cliente } from '../../types';
import { Send, MessageSquare, Search } from 'lucide-react';

export default function Mensagens() {
  const { clientes, loading: loadC } = useClientes();
  const { mensagens: allMensagens, loading: loadM, refetch: reloadAll } = useMensagens();
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [search, setSearch] = useState('');

  const mensagens = selectedCliente 
    ? allMensagens.filter(m => m.remetenteId === selectedCliente.id || m.destinatarioId === selectedCliente.id)
    : [];

  const selectCliente = async (c: Cliente) => {
    setSelectedCliente(c);
    // Mark as read
    const unread = allMensagens.filter(m => m.remetenteId === c.id && !m.lida);
    for (const m of unread) {
      await markMensagemLida(m.id);
    }
    if (unread.length > 0) reloadAll();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !selectedCliente) return;

    await addMensagem({
      remetenteId: 'trainer',
      destinatarioId: selectedCliente.id,
      conteudo: newMsg,
      dataEnvio: new Date().toISOString(),
      lida: false,
      tipo: 'trainer',
    });
    reloadAll();
    setNewMsg('');
  };

  const filteredClientes = clientes.filter(c =>
    c.nome.toLowerCase().includes(search.toLowerCase())
  );

  if (loadC || loadM) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando mensagens...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Mensagens</h1>
        <p>Converse com seus alunos</p>
      </div>

      <div className="chat-layout">
        <div className="chat-sidebar">
          <div className="search-bar" style={{ marginBottom: 0 }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar aluno..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="chat-contacts">
            {filteredClientes.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Nenhum aluno encontrado
              </div>
            ) : (
              filteredClientes.map(c => {
                const msgs = allMensagens.filter(m => m.remetenteId === c.id || m.destinatarioId === c.id);
                const last = msgs[msgs.length - 1];
                return (
                  <div
                    key={c.id}
                    className={`chat-contact ${selectedCliente?.id === c.id ? 'active' : ''}`}
                    onClick={() => selectCliente(c)}
                  >
                    <div className="client-avatar">{c.nome.charAt(0)}</div>
                    <div className="chat-contact-info">
                      <div className="chat-contact-name">{c.nome}</div>
                      <div className="chat-contact-preview">
                        {last ? last.conteudo.substring(0, 35) + (last.conteudo.length > 35 ? '...' : '') : 'Nenhuma mensagem'}
                      </div>
                    </div>
                    {msgs.filter(m => !m.lida && m.tipo === 'aluno').length > 0 && (
                      <div className="chat-unread-badge">
                        {msgs.filter(m => !m.lida && m.tipo === 'aluno').length}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="chat-main">
          {!selectedCliente ? (
            <div className="empty-state">
              <MessageSquare />
              <h3>Selecione um aluno</h3>
              <p>Escolha um aluno na lista para iniciar a conversa</p>
            </div>
          ) : (
            <>
              <div className="chat-header">
                <div className="client-avatar">{selectedCliente.nome.charAt(0)}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '0.95rem' }}>{selectedCliente.nome}</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {selectedCliente.status === 'ativo' ? '● Online' : '○ Offline'}
                  </span>
                </div>
              </div>
              <div className="chat-messages">
                {mensagens.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 40, fontSize: '0.85rem' }}>
                    Nenhuma mensagem ainda. Envie a primeira!
                  </div>
                ) : (
                  mensagens.map(m => (
                    <div key={m.id} className={`chat-bubble ${m.tipo === 'trainer' ? 'sent' : 'received'}`}>
                      <div className="chat-bubble-content">{m.conteudo}</div>
                      <div className="chat-bubble-time">
                        {new Date(m.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  ))
                )}
              </div>
              <form className="chat-input-bar" onSubmit={handleSend}>
                <input
                  type="text"
                  value={newMsg}
                  onChange={e => setNewMsg(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-icon" disabled={!newMsg.trim()}>
                  <Send size={18} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

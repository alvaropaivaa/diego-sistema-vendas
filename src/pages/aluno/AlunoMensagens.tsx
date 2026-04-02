import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useMensagens } from '../../hooks/useData';
import { addMensagem } from '../../data/store';
import { Send, MessageSquare } from 'lucide-react';

export default function AlunoMensagens() {
  const { user } = useAuth();
  const { mensagens, loading, refetch } = useMensagens(user?.id);
  const [newMsg, setNewMsg] = useState('');

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando mensagens...</div>;
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !user?.id) return;

    await addMensagem({
      remetenteId: user.id,
      destinatarioId: 'trainer',
      conteudo: newMsg,
      dataEnvio: new Date().toISOString(),
      lida: false,
      tipo: 'aluno',
    });
    refetch();
    setNewMsg('');
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Mensagens</h1>
        <p>Converse com seu personal trainer</p>
      </div>

      <div className="card" style={{ height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
        <div className="chat-header" style={{ borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
          <div className="client-avatar">D</div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.95rem' }}>Diego Haubricht</h3>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Personal Trainer</span>
          </div>
        </div>

        <div className="chat-messages" style={{ flex: 1 }}>
          {mensagens.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <MessageSquare />
              <h3>Nenhuma mensagem</h3>
              <p>Envie uma mensagem para seu personal!</p>
            </div>
          ) : (
            mensagens.map(m => (
              <div key={m.id} className={`chat-bubble ${m.tipo === 'aluno' ? 'sent' : 'received'}`}>
                <div className="chat-bubble-content">{m.conteudo}</div>
                <div className="chat-bubble-time">
                  {new Date(m.dataEnvio).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        <form className="chat-input-bar" onSubmit={handleSend} style={{ borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
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
      </div>
    </div>
  );
}

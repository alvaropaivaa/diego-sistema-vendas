import { useState } from 'react';
import { useCheckins, useClientes } from '../../hooks/useData';
import { ClipboardCheck, Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function Checkins() {
  const { checkins: rawCheckins, loading: load1 } = useCheckins('');
  const { clientes, loading: load2 } = useClientes();
  const [selectedCliente, setSelectedCliente] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  const checkins = [...rawCheckins];
  const filtered = selectedCliente
    ? checkins.filter(c => c.clienteId === selectedCliente)
    : checkins;

  if (load1 || load2) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando anamneses...</div>;
  }

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Anamneses & Check-ins</h1>
        <p>Acompanhe os formulários quinzenais respondidos pelos alunos</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <select
            className="form-select"
            style={{ width: 250 }}
            value={selectedCliente}
            onChange={e => setSelectedCliente(e.target.value)}
          >
            <option value="">Todos os clientes</option>
            {clientes.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <ClipboardCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3>Nenhuma Anamnese Registrada</h3>
            <p>Os alunos ainda não enviaram check-ins pelo portal deles.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {filtered.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime()).map(c => (
            <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                className="card-header" 
                style={{ padding: 24, margin: 0, cursor: 'pointer', background: expandedId === c.id ? 'var(--bg-tertiary)' : 'transparent' }}
                onClick={() => toggleExpand(c.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="client-avatar" style={{ width: 48, height: 48, fontSize: '1.2rem' }}>
                    {getClienteNome(c.clienteId).charAt(0)}
                  </div>
                  <div>
                    <h2 className="card-title" style={{ marginBottom: 4, fontSize: '1.1rem' }}>{getClienteNome(c.clienteId)}</h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Enviado em: {new Date(c.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Adesão Geral</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent)' }}>
                      {Math.round((c.adesaoTreino + c.adesaoDieta) / 2)}/10
                    </div>
                  </div>
                  {expandedId === c.id ? <ChevronUp size={24} color="var(--text-muted)" /> : <ChevronDown size={24} color="var(--text-muted)" />}
                </div>
              </div>
              
              {expandedId === c.id && (
                <div style={{ padding: 24, borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 24 }}>
                    
                    {/* Bloco Treino */}
                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Treino & Performance
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Adesão:</span> <strong>{c.adesaoTreino}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Freq. Semanal:</span> <strong>{c.frequenciaTreino} dias</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Faltou:</span> <strong>{c.faltouTreino}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Atingiu progressão:</span> <strong>{c.evolucaoCarga}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Intensidade:</span> <strong>{c.intensidadeTreino}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Sentiu dores:</span> <strong>{c.dorDesconforto}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Energia no Treino:</span> <strong>{c.nivelEnergia}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Satisfeito com o Treino:</span> <strong>{c.satisfeitoTreino}</strong></li>
                      </ul>
                    </div>

                    {/* Bloco Dieta e Sono */}
                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Nutrição & Descanso
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Adesão Dieta:</span> <strong>{c.adesaoDieta}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Furos/Lixo:</span> <strong>{c.furosDieta}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Nível Fome:</span> <strong>{c.nivelFome}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Adesão Suplementos:</span> <strong>{c.adesaoSuplementacao}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Usou Correto:</span> <strong>{c.usouSuplementacao}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Sono Diário:</span> <strong>{c.horasSono}h ({c.qualidadeSono})</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Nível Estresse:</span> <strong>{c.nivelEstresse}</strong></li>
                      </ul>
                    </div>

                    {/* Bloco Métricas e Objetivos */}
                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Evolução & Alinhamento
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Peso Atual:</span> <strong style={{color: 'var(--text-primary)', fontSize: '1.1rem'}}>{c.pesoAtual} kg</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Notou evolução visual:</span> <strong>{c.evolucaoFisica}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Objetivo Principal:</span> <strong>{c.objetivoPrincipal}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Comprometimento Próx. 15D:</span> <strong>{c.nivelComprometimento}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Precisa de Ajustes Urgentes?</span> <strong style={{color: c.ajustesPrograma === 'Sim' ? 'var(--danger)' : 'inherit'}}>{c.ajustesPrograma}</strong></li>
                      </ul>

                      {c.pontosMelhoria && (
                        <div style={{ marginTop: 20, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: 8, fontWeight: 600 }}>O que o aluno quer melhorar:</p>
                          <p style={{ fontStyle: 'italic', fontSize: '0.9rem' }}>"{c.pontosMelhoria}"</p>
                        </div>
                      )}
                    </div>
                    
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

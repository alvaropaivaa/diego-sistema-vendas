import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCheckins } from '../../hooks/useData';
import { ClipboardCheck, Target, ChevronDown, ChevronUp } from 'lucide-react';

export default function AlunoCheckins() {
  const { user } = useAuth();
  const { checkins: rawCheckins, loading } = useCheckins(user?.id);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando histórico...</div>;
  }

  const checkins = [...rawCheckins].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Minha Evolução</h1>
        <p>Acompanhe seu histórico de check-ins e respostas</p>
      </div>

      {checkins.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <ClipboardCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: 16 }} />
            <h3>Nenhum check-in registrado</h3>
            <p>Sua primeira anamnese aparecerá aqui após o envio na aba 'Anamnese 15D'.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {checkins.map((c, i) => (
            <div key={c.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div 
                className="card-header" 
                style={{ padding: 24, margin: 0, cursor: 'pointer', background: expandedId === c.id ? 'var(--bg-tertiary)' : 'transparent' }}
                onClick={() => toggleExpand(c.id)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div className="client-avatar" style={{ width: 48, height: 48, fontSize: '1.2rem', background: 'var(--bg-card)' }}>
                    #{checkins.length - i}
                  </div>
                  <div>
                    <h2 className="card-title" style={{ marginBottom: 4, fontSize: '1.1rem' }}>
                      Check-in Quinzenal
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Enviado em: {new Date(c.data).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Peso Registrado</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                      {c.pesoAtual} kg
                    </div>
                  </div>
                  {expandedId === c.id ? <ChevronUp size={24} color="var(--text-muted)" /> : <ChevronDown size={24} color="var(--text-muted)" />}
                </div>
              </div>

              {expandedId === c.id && (
                <div style={{ padding: 24, borderTop: '1px solid var(--border)', background: 'var(--bg-card)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
                    
                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Meu Treino
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Adesão:</span> <strong>{c.adesaoTreino}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Frequência:</span> <strong>{c.frequenciaTreino} dias/sem</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Intensidade:</span> <strong>{c.intensidadeTreino}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Evolução Carga:</span> <strong>{c.evolucaoCarga}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Dores/Dificuldade:</span> <strong>{c.dorDesconforto === 'Sim' ? 'Sim' : c.dificuldadeExercicios}</strong></li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Minha Rotina
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Adesão Dieta:</span> <strong>{c.adesaoDieta}/10</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Furo Dieta:</span> <strong>{c.furosDieta}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Nível Fome:</span> <strong>{c.nivelFome}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Qualidade Sono:</span> <strong>{c.horasSono}h ({c.qualidadeSono})</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Nível Estresse:</span> <strong>{c.nivelEstresse}</strong></li>
                      </ul>
                    </div>

                    <div>
                      <h4 style={{ color: 'var(--accent)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Target size={16} /> Meu Progresso
                      </h4>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        <li><span style={{ color: 'var(--text-muted)' }}>Peso:</span> <strong>{c.pesoAtual} kg</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Motivação:</span> <strong>{c.nivelMotivacao}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Objetivo:</span> <strong>{c.objetivoPrincipal}</strong></li>
                        <li><span style={{ color: 'var(--text-muted)' }}>Satisfeito:</span> <strong>{c.satisfeitoTreino}</strong></li>
                      </ul>
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

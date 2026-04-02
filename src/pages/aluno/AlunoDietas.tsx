import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDietas } from '../../hooks/useData';

import { Salad, ChevronDown, ChevronUp } from 'lucide-react';

export default function AlunoDietas() {
  const { user } = useAuth();
  const { dietas, loading } = useDietas(user?.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>;
  }

  const ativas = dietas.filter(d => d.ativa);
  const inativas = dietas.filter(d => !d.ativa);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Minha Dieta</h1>
        <p>Planos alimentares atribuídos pelo seu personal</p>
      </div>

      {dietas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Salad />
            <h3>Nenhuma dieta atribuída</h3>
            <p>Seu personal trainer ainda não criou nenhum plano alimentar para você</p>
          </div>
        </div>
      ) : (
        <>
          {ativas.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Dietas Ativas ({ativas.length})
              </h2>
              {ativas.map(d => (
                <div key={d.id} className="treino-card" style={{ marginBottom: 12 }}>
                  <div className="treino-card-header" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                    <div>
                      <h3>{d.nome}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {d.objetivo} · {d.totalCalorias} kcal
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-success">Ativa</span>
                      {expanded === d.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {expanded === d.id && (
                    <div className="treino-card-body animate-fadeIn">
                      {d.refeicoes.map(r => (
                        <div key={r.id} className="refeicao-card">
                          <div className="refeicao-header">
                            <h4>{r.nome}</h4>
                            <span className="refeicao-time">{r.horario}</span>
                          </div>
                          <div className="refeicao-body">
                            {r.alimentos.map(a => (
                              <div key={a.id} className="alimento-row">
                                <span style={{ fontWeight: 500 }}>{a.nome}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{a.quantidade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {inativas.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>
                Dietas Anteriores ({inativas.length})
              </h2>
              {inativas.map(d => (
                <div key={d.id} className="treino-card" style={{ marginBottom: 12, opacity: 0.7 }}>
                  <div className="treino-card-header" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
                    <div>
                      <h3>{d.nome}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {d.objetivo} · {d.totalCalorias} kcal
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-muted">Inativa</span>
                      {expanded === d.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {expanded === d.id && (
                    <div className="treino-card-body animate-fadeIn">
                      {d.refeicoes.map(r => (
                        <div key={r.id} className="refeicao-card">
                          <div className="refeicao-header">
                            <h4>{r.nome}</h4>
                            <span className="refeicao-time">{r.horario}</span>
                          </div>
                          <div className="refeicao-body">
                            {r.alimentos.map(a => (
                              <div key={a.id} className="alimento-row">
                                <span style={{ fontWeight: 500 }}>{a.nome}</span>
                                <span style={{ color: 'var(--text-muted)' }}>{a.quantidade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

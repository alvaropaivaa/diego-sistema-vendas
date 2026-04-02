import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTreinos } from '../../hooks/useData';

import { Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';

export default function AlunoTreinos() {
  const { user } = useAuth();
  const { treinos, loading } = useTreinos(user?.id);
  const [expanded, setExpanded] = useState<string | null>(null);

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando treinos...</div>;
  }

  const ativos = treinos.filter(t => t.ativo);
  const inativos = treinos.filter(t => !t.ativo);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Meus Treinos</h1>
        <p>Fichas de treino atribuídas pelo seu personal</p>
      </div>

      {treinos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Dumbbell />
            <h3>Nenhum treino atribuído</h3>
            <p>Seu personal trainer ainda não criou nenhum treino para você</p>
          </div>
        </div>
      ) : (
        <>
          {ativos.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>
                Treinos Ativos ({ativos.length})
              </h2>
              {ativos.map(t => (
                <div key={t.id} className="treino-card" style={{ marginBottom: 12 }}>
                  <div className="treino-card-header" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                    <div>
                      <h3>{t.nome}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {t.tipo} · {t.diasSemana.join(', ')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-success">Ativo</span>
                      {expanded === t.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {expanded === t.id && (
                    <div className="treino-card-body animate-fadeIn">
                      {t.grupos.map(g => (
                        <div key={g.id}>
                          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Exercício</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Séries</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Reps</span>
                            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1 }}>Carga</span>
                          </div>
                          {g.exercicios.map(ex => (
                            <div key={ex.id} className="exercicio-item">
                              <span className="exercicio-name">{ex.nome}</span>
                              <span className="exercicio-detail">{ex.series}x</span>
                              <span className="exercicio-detail">{ex.repeticoes}</span>
                              <span className="exercicio-detail">{ex.carga || '-'}</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {inativos.length > 0 && (
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-muted)' }}>
                Treinos Anteriores ({inativos.length})
              </h2>
              {inativos.map(t => (
                <div key={t.id} className="treino-card" style={{ marginBottom: 12, opacity: 0.7 }}>
                  <div className="treino-card-header" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
                    <div>
                      <h3>{t.nome}</h3>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {t.tipo} · {t.diasSemana.join(', ')}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="badge badge-muted">Inativo</span>
                      {expanded === t.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                  {expanded === t.id && (
                    <div className="treino-card-body animate-fadeIn">
                      {t.grupos.map(g => (
                        <div key={g.id}>
                          {g.exercicios.map(ex => (
                            <div key={ex.id} className="exercicio-item">
                              <span className="exercicio-name">{ex.nome}</span>
                              <span className="exercicio-detail">{ex.series}x{ex.repeticoes}</span>
                              <span className="exercicio-detail">{ex.carga || '-'}</span>
                            </div>
                          ))}
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

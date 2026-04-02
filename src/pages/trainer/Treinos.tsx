import { useState } from 'react';
import { addTreino, deleteTreino } from '../../data/store';
import { useTreinos, useClientes } from '../../hooks/useData';
import { Plus, X, Trash2, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';

export default function Treinos() {
  const { treinos, loading: tLoading, refetch: r1 } = useTreinos();
  const { clientes, loading: cLoading } = useClientes();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const [clienteId, setClienteId] = useState('');
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('Musculação');
  const [diasSemana, setDiasSemana] = useState<string[]>([]);
  const [exercicios, setExercicios] = useState([
    { id: '1', nome: '', series: 3, repeticoes: '12', carga: '', descanso: '60s', observacoes: '' }
  ]);



  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const toggleDay = (day: string) => {
    setDiasSemana(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const addExercicio = () => {
    setExercicios([...exercicios, {
      id: Date.now().toString(), nome: '', series: 3, repeticoes: '12', carga: '', descanso: '60s', observacoes: ''
    }]);
  };

  const removeExercicio = (id: string) => {
    setExercicios(exercicios.filter(e => e.id !== id));
  };

  const updateExercicio = (id: string, field: string, value: string | number) => {
    setExercicios(exercicios.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addTreino({
      clienteId,
      nome,
      tipo,
      diasSemana,
      grupos: [{ id: '1', nome: 'Grupo Principal', exercicios }],
      dataCriacao: new Date().toISOString(),
      ativo: true
    });
    r1();
    setShowModal(false);
    resetForm();
    showToast('Treino criado com sucesso!');
  };

  const resetForm = () => {
    setClienteId('');
    setNome('');
    setTipo('Musculação');
    setDiasSemana([]);
    setExercicios([{ id: '1', nome: '', series: 3, repeticoes: '12', carga: '', descanso: '60s', observacoes: '' }]);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este treino?')) {
      await deleteTreino(id);
      r1();
      showToast('Treino excluído');
    }
  };

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';
  const days = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];

  if (tLoading || cLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando treinos...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Treinos</h1>
        <p>Crie e gerencie fichas de treino</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => { resetForm(); setShowModal(true); }}>
            <Plus size={16} /> Novo Treino
          </button>
        </div>
      </div>

      {treinos.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Dumbbell />
            <h3>Nenhum treino cadastrado</h3>
            <p>Crie a primeira ficha de treino para seus alunos</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Criar Treino
            </button>
          </div>
        </div>
      ) : (
        treinos.map(t => (
          <div key={t.id} className="treino-card">
            <div className="treino-card-header" onClick={() => setExpanded(expanded === t.id ? null : t.id)}>
              <div>
                <h3>{t.nome}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {getClienteNome(t.clienteId)} · {t.tipo} · {t.diasSemana.join(', ')}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${t.ativo ? 'badge-success' : 'badge-muted'}`}>
                  {t.ativo ? 'Ativo' : 'Inativo'}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}>
                  <Trash2 size={15} />
                </button>
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
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Novo Treino</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Cliente</label>
                    <select className="form-select" value={clienteId} onChange={e => setClienteId(e.target.value)} required>
                      <option value="">Selecione</option>
                      {clientes.filter(c => c.status === 'ativo').map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nome do treino</label>
                    <input className="form-input" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Treino A - Peito e Tríceps" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tipo</label>
                    <select className="form-select" value={tipo} onChange={e => setTipo(e.target.value)}>
                      <option>Musculação</option>
                      <option>Funcional</option>
                      <option>Cardio</option>
                      <option>HIIT</option>
                      <option>Alongamento</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Dias da Semana</label>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {days.map(d => (
                        <button
                          key={d}
                          type="button"
                          className={`btn btn-sm ${diasSemana.includes(d) ? 'btn-primary' : 'btn-secondary'}`}
                          onClick={() => toggleDay(d)}
                        >
                          {d}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Exercícios</label>
                    <button type="button" className="btn btn-sm btn-secondary" onClick={addExercicio}>
                      <Plus size={14} /> Adicionar
                    </button>
                  </div>
                  {exercicios.map((ex, i) => (
                    <div key={ex.id} style={{ display: 'grid', gridTemplateColumns: '2fr 80px 80px 100px auto', gap: 8, marginBottom: 8, alignItems: 'end' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        {i === 0 && <label className="form-label">Nome</label>}
                        <input className="form-input" value={ex.nome} onChange={e => updateExercicio(ex.id, 'nome', e.target.value)} placeholder="Ex: Supino reto" />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        {i === 0 && <label className="form-label">Séries</label>}
                        <input className="form-input" type="number" value={ex.series} onChange={e => updateExercicio(ex.id, 'series', parseInt(e.target.value) || 0)} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        {i === 0 && <label className="form-label">Reps</label>}
                        <input className="form-input" value={ex.repeticoes} onChange={e => updateExercicio(ex.id, 'repeticoes', e.target.value)} />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        {i === 0 && <label className="form-label">Carga</label>}
                        <input className="form-input" value={ex.carga} onChange={e => updateExercicio(ex.id, 'carga', e.target.value)} placeholder="Ex: 20kg" />
                      </div>
                      <button type="button" className="btn btn-ghost btn-icon" onClick={() => removeExercicio(ex.id)} style={{ marginBottom: 2 }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Criar Treino</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

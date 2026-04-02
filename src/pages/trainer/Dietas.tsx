import { useState } from 'react';
import { addDieta, deleteDieta } from '../../data/store';
import { useDietas, useClientes } from '../../hooks/useData';
import { Plus, X, Trash2, Salad, ChevronDown, ChevronUp } from 'lucide-react';

export default function Dietas() {
  const { dietas, loading: dLoading, refetch: r1 } = useDietas();
  const { clientes, loading: cLoading } = useClientes();
  const [showModal, setShowModal] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toast, setToast] = useState('');

  const [clienteId, setClienteId] = useState('');
  const [nome, setNome] = useState('');
  const [objetivo, setObjetivo] = useState('');
  const [totalCalorias, setTotalCalorias] = useState('');
  const [refeicoes, setRefeicoes] = useState([
    {
      id: '1', nome: 'Café da Manhã', horario: '07:00',
      alimentos: [{ id: '1', nome: '', quantidade: '', calorias: '', proteinas: '', carboidratos: '', gorduras: '' }]
    }
  ]);



  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const addRefeicao = () => {
    setRefeicoes([...refeicoes, {
      id: Date.now().toString(), nome: '', horario: '',
      alimentos: [{ id: Date.now().toString() + 'a', nome: '', quantidade: '', calorias: '', proteinas: '', carboidratos: '', gorduras: '' }]
    }]);
  };

  const addAlimento = (refId: string) => {
    setRefeicoes(refeicoes.map(r =>
      r.id === refId ? { ...r, alimentos: [...r.alimentos, { id: Date.now().toString(), nome: '', quantidade: '', calorias: '', proteinas: '', carboidratos: '', gorduras: '' }] } : r
    ));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDieta({
      clienteId, nome, objetivo, refeicoes,
      dataCriacao: new Date().toISOString(),
      ativa: true, totalCalorias
    });
    r1();
    setShowModal(false);
    showToast('Dieta criada com sucesso!');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir esta dieta?')) {
      await deleteDieta(id);
      r1();
      showToast('Dieta excluída');
    }
  };

  if (dLoading || cLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dietas...</div>;
  }

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Dietas</h1>
        <p>Planos alimentares dos alunos</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left" />
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={16} /> Nova Dieta
          </button>
        </div>
      </div>

      {dietas.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <Salad />
            <h3>Nenhuma dieta cadastrada</h3>
            <p>Crie o primeiro plano alimentar</p>
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={16} /> Criar Dieta
            </button>
          </div>
        </div>
      ) : (
        dietas.map(d => (
          <div key={d.id} className="treino-card">
            <div className="treino-card-header" onClick={() => setExpanded(expanded === d.id ? null : d.id)}>
              <div>
                <h3>{d.nome}</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>
                  {getClienteNome(d.clienteId)} · {d.objetivo} · {d.totalCalorias} kcal
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className={`badge ${d.ativa ? 'badge-success' : 'badge-muted'}`}>
                  {d.ativa ? 'Ativa' : 'Inativa'}
                </span>
                <button className="btn btn-ghost btn-icon" onClick={(e) => { e.stopPropagation(); handleDelete(d.id); }}>
                  <Trash2 size={15} />
                </button>
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
        ))
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nova Dieta</h2>
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
                    <label className="form-label">Nome do plano</label>
                    <input className="form-input" value={nome} onChange={e => setNome(e.target.value)} placeholder="Ex: Dieta Cutting" required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Objetivo</label>
                    <input className="form-input" value={objetivo} onChange={e => setObjetivo(e.target.value)} placeholder="Ex: Perda de gordura" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Total Calorias (kcal)</label>
                    <input className="form-input" value={totalCalorias} onChange={e => setTotalCalorias(e.target.value)} placeholder="Ex: 2000" />
                  </div>
                </div>

                {refeicoes.map((ref, ri) => (
                  <div key={ref.id} style={{ marginTop: 16, padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Refeição {ri + 1}</label>
                        <input className="form-input" value={ref.nome} onChange={e => {
                          const updated = [...refeicoes];
                          updated[ri].nome = e.target.value;
                          setRefeicoes(updated);
                        }} placeholder="Ex: Café da Manhã" />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Horário</label>
                        <input className="form-input" type="time" value={ref.horario} onChange={e => {
                          const updated = [...refeicoes];
                          updated[ri].horario = e.target.value;
                          setRefeicoes(updated);
                        }} />
                      </div>
                    </div>
                    {ref.alimentos.map((al, ai) => (
                      <div key={al.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 8, marginBottom: 6 }}>
                        <input className="form-input" value={al.nome} onChange={e => {
                          const updated = [...refeicoes];
                          updated[ri].alimentos[ai].nome = e.target.value;
                          setRefeicoes(updated);
                        }} placeholder="Alimento" />
                        <input className="form-input" value={al.quantidade} onChange={e => {
                          const updated = [...refeicoes];
                          updated[ri].alimentos[ai].quantidade = e.target.value;
                          setRefeicoes(updated);
                        }} placeholder="Quantidade" />
                      </div>
                    ))}
                    <button type="button" className="btn btn-sm btn-ghost" onClick={() => addAlimento(ref.id)}>
                      <Plus size={14} /> Alimento
                    </button>
                  </div>
                ))}
                <button type="button" className="btn btn-sm btn-secondary" onClick={addRefeicao} style={{ marginTop: 12 }}>
                  <Plus size={14} /> Adicionar Refeição
                </button>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">Criar Dieta</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

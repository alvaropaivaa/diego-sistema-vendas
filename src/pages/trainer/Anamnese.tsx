import { useState } from 'react';
import { addAnamnese, updateAnamnese } from '../../data/store';
import { useClientes, useAnamneses } from '../../hooks/useData';
import type { Anamnese as AnamneseType } from '../../types';
import { FileText, Plus, X, Eye, Edit2, CheckCircle, Clock } from 'lucide-react';

export default function Anamnese() {
  const { clientes, loading: load1 } = useClientes();
  const { anamneses, loading: load2, refetch: r1 } = useAnamneses();
  const [showModal, setShowModal] = useState(false);
  const [viewModal, setViewModal] = useState<AnamneseType | null>(null);
  const [toast, setToast] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    clienteId: '', objetivoPrincipal: '', tempoTreino: '', lesoes: '',
    doencas: '', medicamentos: '', alergiasAlimentares: '', cirurgias: '',
    frequenciaDesejada: '', nivelAtividade: '', fumante: false,
    bebidaAlcoolica: false, qualidadeSono: '', nivelEstresse: '', observacoes: '',
    status: 'preenchida' as 'pendente' | 'preenchida',
  });



  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const resetForm = () => {
    setForm({
      clienteId: '', objetivoPrincipal: '', tempoTreino: '', lesoes: '',
      doencas: '', medicamentos: '', alergiasAlimentares: '', cirurgias: '',
      frequenciaDesejada: '', nivelAtividade: '', fumante: false,
      bebidaAlcoolica: false, qualidadeSono: '', nivelEstresse: '', observacoes: '',
      status: 'preenchida',
    });
    setEditingId(null);
  };

  const openNew = () => { resetForm(); setShowModal(true); };

  const openEdit = (a: AnamneseType) => {
    setEditingId(a.id);
    setForm({
      clienteId: a.clienteId, objetivoPrincipal: a.objetivoPrincipal,
      tempoTreino: a.tempoTreino, lesoes: a.lesoes, doencas: a.doencas,
      medicamentos: a.medicamentos, alergiasAlimentares: a.alergiasAlimentares,
      cirurgias: a.cirurgias, frequenciaDesejada: a.frequenciaDesejada,
      nivelAtividade: a.nivelAtividade, fumante: a.fumante,
      bebidaAlcoolica: a.bebidaAlcoolica, qualidadeSono: a.qualidadeSono,
      nivelEstresse: a.nivelEstresse, observacoes: a.observacoes,
      status: a.status,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      await updateAnamnese(editingId, { ...form });
      showToast('Anamnese atualizada!');
    } else {
      await addAnamnese({ ...form, data: new Date().toISOString() });
      showToast('Anamnese registrada!');
    }
    r1();
    setShowModal(false);
    resetForm();
  };

  if (load1 || load2) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando anamneses...</div>;
  }

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  const clientesSemAnamnese = clientes.filter(c => !anamneses.find(a => a.clienteId === c.id));

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Anamnese</h1>
        <p>Fichas de avaliação dos alunos</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="stats-mini">
            <span className="stats-mini-item">
              <CheckCircle size={14} /> {anamneses.filter(a => a.status === 'preenchida').length} Preenchidas
            </span>
            <span className="stats-mini-item">
              <Clock size={14} /> {clientesSemAnamnese.length} Pendentes
            </span>
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={16} /> Nova Anamnese
          </button>
        </div>
      </div>

      {anamneses.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <FileText />
            <h3>Nenhuma anamnese registrada</h3>
            <p>Crie a primeira ficha de avaliação</p>
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Criar Anamnese
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Objetivo</th>
                  <th>Nível</th>
                  <th>Frequência</th>
                  <th>Status</th>
                  <th style={{ width: 120 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {anamneses.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="client-avatar">{getClienteNome(a.clienteId).charAt(0)}</div>
                        <span>{getClienteNome(a.clienteId)}</span>
                      </div>
                    </td>
                    <td>{a.objetivoPrincipal || '-'}</td>
                    <td>{a.nivelAtividade || '-'}</td>
                    <td>{a.frequenciaDesejada || '-'}</td>
                    <td>
                      <span className={`badge ${a.status === 'preenchida' ? 'badge-success' : 'badge-warning'}`}>
                        {a.status === 'preenchida' ? 'Preenchida' : 'Pendente'}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => setViewModal(a)} title="Ver">
                          <Eye size={15} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(a)} title="Editar">
                          <Edit2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && (
        <div className="modal-overlay" onClick={() => setViewModal(null)}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Anamnese — {getClienteNome(viewModal.clienteId)}</h2>
              <button className="modal-close" onClick={() => setViewModal(null)}><X size={18} /></button>
            </div>
            <div className="modal-body">
              <div className="anamnese-view-grid">
                <div className="anamnese-item"><strong>Objetivo:</strong> {viewModal.objetivoPrincipal || '-'}</div>
                <div className="anamnese-item"><strong>Tempo de Treino:</strong> {viewModal.tempoTreino || '-'}</div>
                <div className="anamnese-item"><strong>Nível de Atividade:</strong> {viewModal.nivelAtividade || '-'}</div>
                <div className="anamnese-item"><strong>Frequência Desejada:</strong> {viewModal.frequenciaDesejada || '-'}</div>
                <div className="anamnese-item"><strong>Lesões:</strong> {viewModal.lesoes || 'Nenhuma'}</div>
                <div className="anamnese-item"><strong>Doenças:</strong> {viewModal.doencas || 'Nenhuma'}</div>
                <div className="anamnese-item"><strong>Medicamentos:</strong> {viewModal.medicamentos || 'Nenhum'}</div>
                <div className="anamnese-item"><strong>Alergias Alimentares:</strong> {viewModal.alergiasAlimentares || 'Nenhuma'}</div>
                <div className="anamnese-item"><strong>Cirurgias:</strong> {viewModal.cirurgias || 'Nenhuma'}</div>
                <div className="anamnese-item"><strong>Fumante:</strong> {viewModal.fumante ? 'Sim' : 'Não'}</div>
                <div className="anamnese-item"><strong>Bebida Alcoólica:</strong> {viewModal.bebidaAlcoolica ? 'Sim' : 'Não'}</div>
                <div className="anamnese-item"><strong>Qualidade do Sono:</strong> {viewModal.qualidadeSono || '-'}</div>
                <div className="anamnese-item"><strong>Nível de Estresse:</strong> {viewModal.nivelEstresse || '-'}</div>
              </div>
              {viewModal.observacoes && (
                <div style={{ marginTop: 16, padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                  <strong>Observações:</strong> {viewModal.observacoes}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => { setShowModal(false); resetForm(); }}>
          <div className="modal modal-lg" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Editar Anamnese' : 'Nova Anamnese'}</h2>
              <button className="modal-close" onClick={() => { setShowModal(false); resetForm(); }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Aluno</label>
                    <select className="form-select" value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })} required disabled={!!editingId}>
                      <option value="">Selecione</option>
                      {(editingId ? clientes : clientesSemAnamnese).map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Objetivo Principal</label>
                    <select className="form-select" value={form.objetivoPrincipal} onChange={e => setForm({ ...form, objetivoPrincipal: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>Hipertrofia</option>
                      <option>Emagrecimento</option>
                      <option>Condicionamento</option>
                      <option>Saúde</option>
                      <option>Reabilitação</option>
                      <option>Performance</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Tempo de Treino</label>
                    <select className="form-select" value={form.tempoTreino} onChange={e => setForm({ ...form, tempoTreino: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>Iniciante (0-6 meses)</option>
                      <option>Intermediário (6-24 meses)</option>
                      <option>Avançado (2+ anos)</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nível de Atividade</label>
                    <select className="form-select" value={form.nivelAtividade} onChange={e => setForm({ ...form, nivelAtividade: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>Sedentário</option>
                      <option>Leve</option>
                      <option>Moderado</option>
                      <option>Ativo</option>
                      <option>Muito Ativo</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Frequência Desejada</label>
                    <select className="form-select" value={form.frequenciaDesejada} onChange={e => setForm({ ...form, frequenciaDesejada: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>2x por semana</option>
                      <option>3x por semana</option>
                      <option>4x por semana</option>
                      <option>5x por semana</option>
                      <option>6x por semana</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Qualidade do Sono</label>
                    <select className="form-select" value={form.qualidadeSono} onChange={e => setForm({ ...form, qualidadeSono: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>Excelente</option>
                      <option>Boa</option>
                      <option>Regular</option>
                      <option>Ruim</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Nível de Estresse</label>
                    <select className="form-select" value={form.nivelEstresse} onChange={e => setForm({ ...form, nivelEstresse: e.target.value })}>
                      <option value="">Selecione</option>
                      <option>Baixo</option>
                      <option>Moderado</option>
                      <option>Alto</option>
                      <option>Muito Alto</option>
                    </select>
                  </div>
                  <div className="form-group" style={{ display: 'flex', gap: 24, alignItems: 'end', paddingBottom: 8 }}>
                    <label className="form-checkbox">
                      <input type="checkbox" checked={form.fumante} onChange={e => setForm({ ...form, fumante: e.target.checked })} />
                      Fumante
                    </label>
                    <label className="form-checkbox">
                      <input type="checkbox" checked={form.bebidaAlcoolica} onChange={e => setForm({ ...form, bebidaAlcoolica: e.target.checked })} />
                      Bebida Alcoólica
                    </label>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Lesões</label>
                    <input className="form-input" value={form.lesoes} onChange={e => setForm({ ...form, lesoes: e.target.value })} placeholder="Descreva lesões anteriores ou atuais" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doenças</label>
                    <input className="form-input" value={form.doencas} onChange={e => setForm({ ...form, doencas: e.target.value })} placeholder="Doenças pré-existentes" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Medicamentos</label>
                    <input className="form-input" value={form.medicamentos} onChange={e => setForm({ ...form, medicamentos: e.target.value })} placeholder="Medicamentos em uso" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alergias Alimentares</label>
                    <input className="form-input" value={form.alergiasAlimentares} onChange={e => setForm({ ...form, alergiasAlimentares: e.target.value })} placeholder="Alergias alimentares" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cirurgias</label>
                  <input className="form-input" value={form.cirurgias} onChange={e => setForm({ ...form, cirurgias: e.target.value })} placeholder="Cirurgias anteriores" />
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea" value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} placeholder="Observações adicionais..." />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => { setShowModal(false); resetForm(); }}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editingId ? 'Salvar' : 'Registrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

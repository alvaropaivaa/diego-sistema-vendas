import { useState, useEffect } from 'react';
import { addPagamento, updatePagamento, deletePagamento } from '../../data/store';
import { usePagamentos, useClientes, useConfiguracoes } from '../../hooks/useData';
import type { Pagamento } from '../../types';
import { Plus, X, DollarSign, Trash2, Edit2, CheckCircle, AlertTriangle, Clock, TrendingUp } from 'lucide-react';

export default function Financeiro() {
  const { pagamentos: rawPagamentos, loading: pLoading, refetch: reload } = usePagamentos();
  const { clientes, loading: cLoading } = useClientes();
  const { config, loading: configLoading } = useConfiguracoes();
  
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Pagamento | null>(null);
  const [toast, setToast] = useState('');
  const [filterStatus, setFilterStatus] = useState<'todos' | 'pago' | 'pendente' | 'atrasado'>('todos');

  const [form, setForm] = useState({
    clienteId: '', valor: 0, dataVencimento: '',
    dataPagamento: null as string | null, status: 'pendente' as Pagamento['status'],
    mesReferencia: '', formaPagamento: '', observacoes: '',
  });

  const pagamentos = [...rawPagamentos];

  useEffect(() => {
    if (config) {
      setForm(f => ({ ...f, valor: config.valorMensalidade }));
    }
  }, [config]);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const openNew = () => {
    setEditing(null);
    const now = new Date();
    const mesRef = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    setForm({
      clienteId: '', valor: config?.valorMensalidade || 0,
      dataVencimento: '', dataPagamento: null,
      status: 'pendente', mesReferencia: mesRef,
      formaPagamento: '', observacoes: ''
    });
    setShowModal(true);
  };

  const openEdit = (p: Pagamento) => {
    setEditing(p);
    setForm({
      clienteId: p.clienteId, valor: p.valor,
      dataVencimento: p.dataVencimento, dataPagamento: p.dataPagamento,
      status: p.status, mesReferencia: p.mesReferencia,
      formaPagamento: p.formaPagamento, observacoes: p.observacoes,
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updatePagamento(editing.id, form);
      showToast('Pagamento atualizado!');
    } else {
      await addPagamento(form);
      showToast('Pagamento registrado!');
    }
    reload();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Excluir este registro?')) {
      await deletePagamento(id);
      reload();
      showToast('Registro excluído');
    }
  };

  const markPago = async (p: Pagamento) => {
    await updatePagamento(p.id, {
      status: 'pago',
      dataPagamento: new Date().toISOString().split('T')[0],
    });
    reload();
    showToast('Marcado como pago!');
  };

  const getClienteNome = (id: string) => clientes.find(c => c.id === id)?.nome || 'Desconhecido';

  const filtered = pagamentos.filter(p => filterStatus === 'todos' || p.status === filterStatus);

  const totalRecebido = pagamentos.filter(p => p.status === 'pago').reduce((a, b) => a + b.valor, 0);
  const totalPendente = pagamentos.filter(p => p.status === 'pendente').reduce((a, b) => a + b.valor, 0);
  const totalAtrasado = pagamentos.filter(p => p.status === 'atrasado').reduce((a, b) => a + b.valor, 0);

  const statusIcon = (s: string) => {
    if (s === 'pago') return <CheckCircle size={14} />;
    if (s === 'atrasado') return <AlertTriangle size={14} />;
    return <Clock size={14} />;
  };

  if (pLoading || cLoading || configLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando financeiro...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Financeiro</h1>
        <p>Controle de mensalidades e pagamentos</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-fadeInUp stagger-1">
          <div className="stat-card-icon" style={{ color: '#10b981' }}><TrendingUp /></div>
          <div className="stat-card-value">R$ {totalRecebido.toFixed(2)}</div>
          <div className="stat-card-label">Recebido</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-2">
          <div className="stat-card-icon" style={{ color: '#f59e0b' }}><Clock /></div>
          <div className="stat-card-value">R$ {totalPendente.toFixed(2)}</div>
          <div className="stat-card-label">Pendente</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-3">
          <div className="stat-card-icon" style={{ color: '#ef4444' }}><AlertTriangle /></div>
          <div className="stat-card-value">R$ {totalAtrasado.toFixed(2)}</div>
          <div className="stat-card-label">Atrasado</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-4">
          <div className="stat-card-icon"><DollarSign /></div>
          <div className="stat-card-value">R$ {(totalRecebido + totalPendente + totalAtrasado).toFixed(2)}</div>
          <div className="stat-card-label">Total Geral</div>
        </div>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
            {(['todos', 'pago', 'pendente', 'atrasado'] as const).map(f => (
              <button key={f} className={`tab ${filterStatus === f ? 'active' : ''}`} onClick={() => setFilterStatus(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}s
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={16} /> Novo Pagamento
          </button>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <DollarSign />
            <h3>Nenhum registro encontrado</h3>
            <p>Registre o primeiro pagamento</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Aluno</th>
                  <th>Mês Ref.</th>
                  <th>Valor</th>
                  <th>Vencimento</th>
                  <th>Pagamento</th>
                  <th>Forma</th>
                  <th>Status</th>
                  <th style={{ width: 140 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div className="client-avatar">{getClienteNome(p.clienteId).charAt(0)}</div>
                        <span>{getClienteNome(p.clienteId)}</span>
                      </div>
                    </td>
                    <td>{p.mesReferencia}</td>
                    <td style={{ fontWeight: 600 }}>R$ {p.valor.toFixed(2)}</td>
                    <td>{p.dataVencimento ? new Date(p.dataVencimento + 'T12:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{p.dataPagamento ? new Date(p.dataPagamento + 'T12:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td>{p.formaPagamento || '-'}</td>
                    <td>
                      <span className={`badge ${p.status === 'pago' ? 'badge-success' : p.status === 'atrasado' ? 'badge-danger' : 'badge-warning'}`}>
                        {statusIcon(p.status)} {p.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        {p.status !== 'pago' && (
                          <button className="btn btn-ghost btn-icon" onClick={() => markPago(p)} title="Marcar como pago">
                            <CheckCircle size={15} />
                          </button>
                        )}
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(p)} title="Editar">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(p.id)} title="Excluir">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Editar Pagamento' : 'Novo Pagamento'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}><X size={18} /></button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Aluno</label>
                    <select className="form-select" value={form.clienteId} onChange={e => setForm({ ...form, clienteId: e.target.value })} required>
                      <option value="">Selecione</option>
                      {clientes.filter(c => c.status === 'ativo').map(c => (
                        <option key={c.id} value={c.id}>{c.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Valor (R$)</label>
                    <input className="form-input" type="number" step="0.01" value={form.valor} onChange={e => setForm({ ...form, valor: parseFloat(e.target.value) || 0 })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Mês Referência</label>
                    <input className="form-input" type="month" value={form.mesReferencia} onChange={e => setForm({ ...form, mesReferencia: e.target.value })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data de Vencimento</label>
                    <input className="form-input" type="date" value={form.dataVencimento} onChange={e => setForm({ ...form, dataVencimento: e.target.value })} required />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Pagamento</label>
                    <input className="form-input" type="date" value={form.dataPagamento || ''} onChange={e => setForm({ ...form, dataPagamento: e.target.value || null })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as Pagamento['status'] })}>
                      <option value="pendente">Pendente</option>
                      <option value="pago">Pago</option>
                      <option value="atrasado">Atrasado</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Forma de Pagamento</label>
                  <select className="form-select" value={form.formaPagamento} onChange={e => setForm({ ...form, formaPagamento: e.target.value })}>
                    <option value="">Selecione</option>
                    <option>PIX</option>
                    <option>Dinheiro</option>
                    <option>Cartão de Crédito</option>
                    <option>Cartão de Débito</option>
                    <option>Transferência</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea" value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Salvar' : 'Registrar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

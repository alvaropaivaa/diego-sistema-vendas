import { useState } from 'react';
import { addCliente, updateCliente, deleteCliente } from '../../data/store';
import { useClientes } from '../../hooks/useData';
import type { Cliente } from '../../types';
import { Search, Plus, X, Edit2, Trash2, Users } from 'lucide-react';

export default function Clientes() {
  const { clientes, loading, refetch: reload } = useClientes();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'todos' | 'ativo' | 'inativo'>('todos');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({
    nome: '', email: '', telefone: '', dataNascimento: '',
    objetivo: '', status: 'ativo' as 'ativo' | 'inativo',
    dataInicio: new Date().toISOString().split('T')[0], observacoes: ''
  });
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const filtered = clientes.filter(c => {
    const matchSearch = c.nome.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'todos' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const openNew = () => {
    setEditing(null);
    setForm({
      nome: '', email: '', telefone: '', dataNascimento: '',
      objetivo: '', status: 'ativo', dataInicio: new Date().toISOString().split('T')[0], observacoes: ''
    });
    setShowModal(true);
  };

  const openEdit = (c: Cliente) => {
    setEditing(c);
    setForm({
      nome: c.nome, email: c.email, telefone: c.telefone,
      dataNascimento: c.dataNascimento, objetivo: c.objetivo,
      status: c.status, dataInicio: c.dataInicio, observacoes: c.observacoes
    });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editing) {
      await updateCliente(editing.id, form);
      showToast('Cliente atualizado com sucesso!');
    } else {
      await addCliente(form);
      showToast('Cliente cadastrado com sucesso!');
    }
    reload();
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteCliente(id);
      reload();
      showToast('Cliente excluído');
    }
  };

  if (loading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando clientes...</div>;
  }

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <h1>Clientes</h1>
        <p>Gerencie seus alunos</p>
      </div>

      <div className="toolbar">
        <div className="toolbar-left">
          <div className="search-bar" style={{ marginBottom: 0, flex: 1, maxWidth: 400 }}>
            <Search />
            <input
              type="text"
              placeholder="Buscar clientes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="tabs" style={{ marginBottom: 0, borderBottom: 'none' }}>
            {(['todos', 'ativo', 'inativo'] as const).map(f => (
              <button
                key={f}
                className={`tab ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}s
              </button>
            ))}
          </div>
        </div>
        <div className="toolbar-right">
          <button className="btn btn-primary" onClick={openNew}>
            <Plus size={16} /> Novo Cliente
          </button>
        </div>
      </div>

      <div className="card">
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Users />
            <h3>Nenhum cliente encontrado</h3>
            <p>Cadastre seu primeiro cliente para começar</p>
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={16} /> Cadastrar Cliente
            </button>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Telefone</th>
                  <th>Objetivo</th>
                  <th>Início</th>
                  <th>Status</th>
                  <th style={{ width: 100 }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div className="client-avatar">{c.nome.charAt(0)}</div>
                        <div>
                          <div className="client-name">{c.nome}</div>
                          <div className="client-email">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>{c.telefone}</td>
                    <td>{c.objetivo}</td>
                    <td>{c.dataInicio ? new Date(c.dataInicio + 'T12:00').toLocaleDateString('pt-BR') : '-'}</td>
                    <td>
                      <span className={`badge ${c.status === 'ativo' ? 'badge-success' : 'badge-muted'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => openEdit(c)} title="Editar">
                          <Edit2 size={15} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(c.id)} title="Excluir">
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
              <h2>{editing ? 'Editar Cliente' : 'Novo Cliente'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Nome completo</label>
                  <input className="form-input" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">E-mail</label>
                    <input className="form-input" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Telefone</label>
                    <input className="form-input" value={form.telefone} onChange={e => setForm({ ...form, telefone: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Data de Nascimento</label>
                    <input className="form-input" type="date" value={form.dataNascimento} onChange={e => setForm({ ...form, dataNascimento: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Data de Início</label>
                    <input className="form-input" type="date" value={form.dataInicio} onChange={e => setForm({ ...form, dataInicio: e.target.value })} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Objetivo</label>
                    <select className="form-select" value={form.objetivo} onChange={e => setForm({ ...form, objetivo: e.target.value })}>
                      <option value="">Selecione</option>
                      <option value="Hipertrofia">Hipertrofia</option>
                      <option value="Emagrecimento">Emagrecimento</option>
                      <option value="Condicionamento">Condicionamento</option>
                      <option value="Saúde">Saúde</option>
                      <option value="Reabilitação">Reabilitação</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={form.status} onChange={e => setForm({ ...form, status: e.target.value as 'ativo' | 'inativo' })}>
                      <option value="ativo">Ativo</option>
                      <option value="inativo">Inativo</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Observações</label>
                  <textarea className="form-textarea" value={form.observacoes} onChange={e => setForm({ ...form, observacoes: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Salvar Alterações' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toast && <div className="toast success">{toast}</div>}
    </div>
  );
}

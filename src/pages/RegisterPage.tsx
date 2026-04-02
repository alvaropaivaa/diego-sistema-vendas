import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { addCliente } from '../data/store';
import { ArrowLeft, UserPlus, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    objetivo: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const newCliente = await addCliente({
        ...form,
        status: 'ativo',
        dataInicio: new Date().toISOString().split('T')[0],
        observacoes: 'Cadastrado via portal',
      });

      setSuccess(true);
      setTimeout(() => {
        login('aluno', newCliente.nome, newCliente.id);
        navigate('/aluno/dashboard');
      }, 2000);
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente mais tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="login-page">
        <div className="login-container animate-fadeIn" style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ color: 'var(--success)', marginBottom: '20px' }}>
            <CheckCircle2 size={64} style={{ margin: '0 auto' }} />
          </div>
          <h1 style={{ marginBottom: '10px' }}>Conta Criada!</h1>
          <p style={{ color: 'var(--text-muted)' }}>Bem-vindo ao Team Haubricht. Redirecionando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container animate-fadeInUp">
        <button className="login-back" onClick={() => navigate('/login/aluno')}>
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="login-header">
          <div className="profile-logo-img" style={{ margin: '0 auto 20px' }}>
            <img src="/logo.png" alt="Logo" />
          </div>
          <h1>Criar Conta</h1>
          <p>Junte-se ao time e comece sua transformação</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>Nome Completo</label>
            <input
              type="text"
              value={form.nome}
              onChange={e => setForm({ ...form, nome: e.target.value })}
              placeholder="Como quer ser chamado?"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="seu@email.com"
                required
              />
            </div>
            <div className="form-group">
              <label>WhatsApp</label>
              <input
                type="tel"
                value={form.telefone}
                onChange={e => setForm({ ...form, telefone: e.target.value })}
                placeholder="(00) 00000-0000"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Data de Nascimento</label>
            <input
              type="date"
              value={form.dataNascimento}
              onChange={e => setForm({ ...form, dataNascimento: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Qual seu objetivo principal?</label>
            <select 
              className="form-select"
              value={form.objetivo}
              onChange={e => setForm({ ...form, objetivo: e.target.value })}
              required
            >
              <option value="">Selecione um objetivo</option>
              <option value="Hipertrofia">Hipertrofia (Ganho de Massa)</option>
              <option value="Emagrecimento">Emagrecimento / Definição</option>
              <option value="Condicionamento">Saúde / Condicionamento</option>
              <option value="Performance">Performance Esportiva</option>
            </select>
          </div>

          <button type="submit" className="login-btn" disabled={loading} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {loading ? 'Criando conta...' : (
              <>
                <UserPlus size={18} />
                Finalizar Cadastro
              </>
            )}
          </button>
        </form>

        <div className="login-quote" style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            Ao se cadastrar, você concorda com nossos termos de uso e política de privacidade.
          </p>
        </div>
      </div>
    </div>
  );
}

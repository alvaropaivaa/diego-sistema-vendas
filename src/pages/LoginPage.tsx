import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { getClientes } from '../data/store';

const quotes = [
  'O corpo alcança o que a mente acredita.',
  'Disciplina é a ponte entre metas e conquistas.',
  'Cada treino te leva mais perto do seu objetivo.',
  'A dor de hoje é a vitória de amanhã.',
  'Não pare quando estiver cansado, pare quando terminar.',
  'O sucesso é a soma de pequenos esforços repetidos dia após dia.',
];

export default function LoginPage() {
  const { tipo } = useParams<{ tipo: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const isTrainer = tipo === 'trainer';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isTrainer) {
      if (username.toLowerCase() === 'diego' && password === 'admin') {
        login('trainer', 'Diego Haubricht');
        navigate('/trainer/dashboard');
      } else {
        setError('Usuário ou senha incorretos');
      }
    } else {
      const clientes = await getClientes();
      const cliente = clientes.find(
        c => c.nome.toLowerCase() === username.toLowerCase() && c.status === 'ativo'
      );
      if (cliente) {
        login('aluno', cliente.nome, cliente.id);
        navigate('/aluno/dashboard');
      } else {
        setError('Aluno não encontrado ou inativo');
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <button className="login-back" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          Voltar
        </button>

        <div className="login-header">
          <div className="profile-logo-img" style={{ margin: '0 auto 20px' }}>
            <img src="/logo.png" alt="Logo" />
          </div>
          <h1>{isTrainer ? 'Personal Trainer' : 'Portal do Aluno'}</h1>
          <p>Faça login para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && <div className="login-error">{error}</div>}

          <div className="form-group">
            <label>{isTrainer ? 'Usuário' : 'Nome completo'}</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder={isTrainer ? 'Digite seu usuário' : 'Digite seu nome completo'}
              required
              autoFocus
            />
          </div>

          {isTrainer && (
            <div className="form-group">
              <label>Senha</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                required
              />
            </div>
          )}

          <button type="submit" className="login-btn">
            Entrar
          </button>
          {!isTrainer && (
            <div style={{ marginTop: '20px', textAlign: 'center' }}>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Ainda não tem uma conta?{' '}
                <span 
                  onClick={() => navigate('/register')} 
                  style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Cadastre-se aqui
                </span>
              </p>
            </div>
          )}
        </form>

        <div className="login-quote">
          <p>"{quote}"</p>
        </div>
      </div>
    </div>
  );
}

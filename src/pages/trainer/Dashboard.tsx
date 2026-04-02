import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClientes, useCheckins, useAnamneses, useConfiguracoes } from '../../hooks/useData';
import { Users, ClipboardCheck, FileText, UserCheck } from 'lucide-react';

export default function Dashboard() {
  const { user, loginTime } = useAuth();
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const { clientes, loading: load1 } = useClientes();
  const { checkins, loading: load2 } = useCheckins();
  const { anamneses, loading: load3 } = useAnamneses();
  const { config, loading: load4 } = useConfiguracoes();

  if (load1 || load2 || load3 || load4 || !config) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>;
  }

  const clientesAtivos = clientes.filter(c => c.status === 'ativo');
  const anamnesesPendentes = clientes.filter(c => {
    const a = anamneses.find(an => an.clienteId === c.id);
    return !a || a.status === 'pendente';
  });

  const percent = config.metaMensal > 0 ? Math.round((clientesAtivos.length / config.metaMensal) * 100) : 0;

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Bom dia';
    if (h < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const quotes = [
    'O corpo alcança o que a mente acredita.',
    'Disciplina é a ponte entre metas e conquistas.',
    'A dor de hoje é a vitória de amanhã.',
    'Cada treino te leva mais perto do seu objetivo.',
  ];
  const [quote] = useState(() => quotes[Math.floor(Math.random() * quotes.length)]);

  const circumference = 2 * Math.PI * 68;
  const dashOffset = circumference - (percent / 100) * circumference;

  // Dot position
  const angle = (percent / 100) * 360 - 90;
  const rad = (angle * Math.PI) / 180;
  const dotX = 80 + 68 * Math.cos(rad);
  const dotY = 80 + 68 * Math.sin(rad);

  return (
    <div className="animate-fadeIn">
      <div className="page-header">
        <div className="page-header-welcome">
          <h1>
            {greeting}, {user?.nome?.split(' ')[0] || 'Diego'}! 👋
          </h1>
        </div>
        <p>
          Login em {loginTime} — <span className="page-header-quote">{quote}</span>
        </p>
      </div>

      <div className="stats-grid">
        <div className="stat-card animate-fadeInUp stagger-1">
          <div className="stat-card-icon"><Users /></div>
          <div className="stat-card-value">{clientesAtivos.length}</div>
          <div className="stat-card-label">Clientes Ativos</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-2">
          <div className="stat-card-icon"><ClipboardCheck /></div>
          <div className="stat-card-value">{checkins.length}</div>
          <div className="stat-card-label">Check-ins</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-3">
          <div className="stat-card-icon"><FileText /></div>
          <div className="stat-card-value">{anamnesesPendentes.length}</div>
          <div className="stat-card-label">Anamneses Pendentes</div>
        </div>
        <div className="stat-card animate-fadeInUp stagger-4">
          <div className="stat-card-icon"><UserCheck /></div>
          <div className="stat-card-value">{clientes.length}</div>
          <div className="stat-card-label">Total Clientes</div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="card animate-fadeInUp stagger-3">
          <div className="card-header">
            <h2 className="card-title">Meta Mensal</h2>
          </div>
          <div className="progress-ring-container">
            <div className="progress-ring">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle className="progress-ring-bg" cx="80" cy="80" r="68" />
                <circle
                  className="progress-ring-fill"
                  cx="80" cy="80" r="68"
                  strokeDasharray={circumference}
                  strokeDashoffset={dashOffset}
                />
              </svg>
              <div className="progress-ring-text">{percent}%</div>
              {percent > 0 && (
                <div
                  className="progress-ring-dot"
                  style={{ left: dotX - 5, top: dotY - 5 }}
                />
              )}
            </div>
            <div className="progress-ring-label">
              {clientesAtivos.length}/{config.metaMensal} clientes
            </div>
          </div>
        </div>

        <div className="card animate-fadeInUp stagger-4">
          <div className="card-header">
            <h2 className="card-title">Clientes Recentes</h2>
          </div>
          <div className="client-list">
            {clientes.length === 0 ? (
              <div className="empty-state">
                <Users />
                <p>Nenhum cliente cadastrado</p>
              </div>
            ) : (
              clientes.slice(-5).reverse().map(c => (
                <div key={c.id} className="client-row">
                  <div className="client-avatar">
                    {c.nome.charAt(0).toUpperCase()}
                  </div>
                  <div className="client-info">
                    <div className="client-name">{c.nome}</div>
                    <div className="client-email">{c.email}</div>
                  </div>
                  <span className={`badge ${c.status === 'ativo' ? 'badge-success' : 'badge-muted'}`}>
                    {c.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

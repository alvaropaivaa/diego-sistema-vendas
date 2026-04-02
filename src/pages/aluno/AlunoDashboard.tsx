import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTreinos, useCheckins, useClientes } from '../../hooks/useData';
import { Dumbbell, Salad, ClipboardCheck, BarChart3, Droplets, Droplet } from 'lucide-react';

export default function AlunoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hydration, setHydration] = useState(0);

  const clienteId = user?.id || '';
  const { treinos: allTreinos, loading: tLoading } = useTreinos(clienteId);
  const { clientes, loading: cLoading } = useClientes();
  const { checkins, loading: chLoading } = useCheckins(clienteId);
  
  if (tLoading || cLoading || chLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>;
  }

  const treinos = allTreinos.filter(t => t.ativo);
  const clienteData = clientes.find(c => c.id === clienteId);
  
  const lastCheckin = checkins.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
  const pesoAtual = lastCheckin?.pesoAtual || '--';
  const metaObj = clienteData?.objetivo || '--';

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'BOM DIA';
    if (h < 18) return 'BOA TARDE';
    return 'BOA NOITE';
  }, []);

  const primeiroTreino = treinos[0];

  const handleDrinkWater = () => {
    if (hydration < 8) {
      setHydration(prev => prev + 1);
    } else {
      setHydration(0); // Reset for fun
    }
  };

  return (
    <div className="mobile-dashboard">
      
      {/* GREETING SECTION */}
      <div className="mobile-greeting-section">
        <div className="mobile-greeting-sub">{greeting},</div>
        <div className="mobile-greeting-name">{user?.nome?.split(' ')[0] || 'ALUNO'}</div>
      </div>

      {/* METRICS ROW */}
      <div className="mobile-metrics-row">
        <div className="mobile-metric-card">
          <div className="mobile-metric-label">PESO ATUAL</div>
          <div className="mobile-metric-value">{pesoAtual} <span className="mobile-metric-unit">kg</span></div>
        </div>
        <div className="mobile-metric-card">
          <div className="mobile-metric-label">META</div>
          <div className="mobile-metric-value objetivo-text">{metaObj}</div>
        </div>
      </div>

      {/* TODAY'S WORKOUT */}
      <div className="mobile-workout-card" onClick={() => navigate('/aluno/treinos')}>
        <div className="mobile-workout-header">
          <Dumbbell size={16} className="text-accent" />
          <span>TREINO DE HOJE</span>
        </div>
        
        {primeiroTreino ? (
          <>
            <div className="mobile-workout-title">{primeiroTreino.nome}</div>
            <div className="mobile-workout-details">
              <span>{primeiroTreino.grupos.length} Blocos</span>
              <span className="mobile-workout-accent">
                {primeiroTreino.grupos.reduce((acc, g) => acc + g.exercicios.length, 0)} exercícios
              </span>
            </div>
          </>
        ) : (
          <div className="mobile-workout-empty">Nenhum treino prescrito</div>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="mobile-actions-grid">
        <button className="mobile-action-btn" onClick={() => navigate('/aluno/anamnese')}>
          <ClipboardCheck size={28} className="text-accent mb-1" />
          <span>CHECK-IN</span>
        </button>
        <button className="mobile-action-btn" onClick={() => navigate('/aluno/dietas')}>
          <Salad size={28} className="text-accent mb-1" />
          <span>DIETA</span>
        </button>
        <button className="mobile-action-btn" onClick={() => navigate('/aluno/checkins')}>
          <BarChart3 size={28} className="text-accent mb-1" />
          <span>EVOLUÇÃO</span>
        </button>
      </div>

      {/* SOMETHING INCREDIBLE: HYDRATION TRACKER */}
      <div className="mobile-hydration-card">
        <div className="mobile-workout-header" style={{ marginBottom: 16 }}>
          <Droplets size={16} className="text-accent" />
          <span>META DE ÁGUA VITAL</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{hydration * 250}ml consumidos</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{hydration}/8 copos</span>
        </div>
        
        <div className="hydration-cups" onClick={handleDrinkWater}>
          {[...Array(8)].map((_, i) => (
            <div key={i} className={`hydration-cup ${i < hydration ? 'filled' : ''}`}>
              <Droplet size={18} fill={i < hydration ? 'var(--accent)' : 'none'} color={i < hydration ? 'var(--accent)' : 'var(--text-muted)'} />
            </div>
          ))}
        </div>
        
        <div style={{ marginTop: 12, fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', fontStyle: 'italic' }}>
          Toque nas gotas para registrar seu consumo diário (2L meta).
        </div>
      </div>

    </div>
  );
}

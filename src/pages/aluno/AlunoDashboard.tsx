import { useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTreinos, useCheckins, useClientes, useAnamneses, useDietas } from '../../hooks/useData';
import { 
  Dumbbell, 
  Salad, 
  ClipboardCheck, 
  BarChart3, 
  Droplets, 
  Droplet, 
  Sparkles, 
  Clock, 
  ChevronRight 
} from 'lucide-react';

export default function AlunoDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [hydration, setHydration] = useState(0);

  const greeting = useMemo(() => {
    const h = new Date().getHours();
    if (h < 12) return 'BOM DIA';
    if (h < 18) return 'BOA TARDE';
    return 'BOA NOITE';
  }, []);

  const clienteId = user?.id || '';
  const { treinos: allTreinos, loading: tLoading } = useTreinos(clienteId);
  const { dietas, loading: dLoading } = useDietas(clienteId);
  const { clientes, loading: cLoading } = useClientes();
  const { checkins, loading: chLoading } = useCheckins(clienteId);
  const { anamneses, loading: aLoading } = useAnamneses(clienteId);
  
  if (tLoading || cLoading || chLoading || aLoading || dLoading) {
    return <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>Carregando dados...</div>;
  }

  const hasAnamnese = anamneses.length > 0;
  const hasPlan = allTreinos.length > 0 || dietas.length > 0;
  
  const treinos = allTreinos.filter(t => t.ativo);
  const clienteData = clientes.find(c => c.id === clienteId);
  
  const lastCheckin = checkins.sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())[0];
  const pesoAtual = lastCheckin?.pesoAtual || '--';
  const metaObj = clienteData?.objetivo || '--';

  const primeiroTreino = treinos[0];

  const handleDrinkWater = () => {
    if (hydration < 8) {
      setHydration(prev => prev + 1);
    } else {
      setHydration(0); // Reset for fun
    }
  };

  // STATE A: MANDATORY ANAMNESIS
  if (!hasAnamnese) {
    return (
      <div className="mobile-dashboard" style={{ justifyContent: 'center', minHeight: '80vh' }}>
        <div className="onboarding-card">
          <div className="onboarding-icon">
            <Sparkles size={40} />
          </div>
          <h2>BEM-VINDO!</h2>
          <p>Para o Diego montar seu treino e dieta personalizados, ele precisa te conhecer melhor. Vamos preencher sua anamnese?</p>
          <button className="onboarding-btn" onClick={() => navigate('/aluno/anamnese-inicial')}>
            Começar Agora <ChevronRight size={20} />
          </button>
        </div>
      </div>
    );
  }

  // STATE B: WAITING FOR PLAN
  if (!hasPlan) {
    return (
      <div className="mobile-dashboard" style={{ justifyContent: 'center', minHeight: '80vh' }}>
        <div className="onboarding-card waiting-card">
          <div className="onboarding-icon waiting-icon">
            <Clock size={40} />
          </div>
          <h2>PLANO EM PRODUÇÃO</h2>
          <p>O Diego já recebeu sua anamnese e está preparando sua dieta e treino com base nos seus objetivos. Em breve estará disponível aqui!</p>
          <div className="loader-dots">
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
            <div className="loader-dot"></div>
          </div>
        </div>
      </div>
    );
  }

  // STATE C: NORMAL DASHBOARD
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

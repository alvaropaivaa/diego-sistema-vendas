import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Dumbbell, Salad, ClipboardCheck, MessageSquare, LogOut, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMensagensInfo } from '../../data/store';

const navItems = [
  { to: '/aluno/dashboard', icon: LayoutDashboard, label: 'Home' },
  { to: '/aluno/treinos', icon: Dumbbell, label: 'Treino' },
  { to: '/aluno/dietas', icon: Salad, label: 'Dieta' },
  { to: '/aluno/checkins', icon: ClipboardCheck, label: 'Evolução' },
  { to: '/aluno/mensagens', icon: User, label: 'Perfil' },
];

export default function AlunoLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user?.id) {
      getMensagensInfo(user.id, 'aluno').then(({ unread }) => setUnreadCount(unread));
    }
  }, [user, location.pathname]); 

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="mobile-app-layout">
      {/* HEADER FIXO TOPO */}
      <header className="mobile-header">
        <div className="mobile-header-left">
          <div className="mobile-header-logo">
            <img src="/logo.png" alt="Logo" />
          </div>
          <div className="mobile-header-title">Team Haubricht</div>
        </div>
        <div className="mobile-header-actions">
          <button 
            className="btn-icon btn-ghost"
            onClick={() => navigate('/aluno/mensagens')}
            style={{ position: 'relative' }}
          >
            <MessageSquare size={20} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: -4,
                right: -4,
                background: 'var(--danger)',
                color: 'white',
                fontSize: '0.65rem',
                fontWeight: 'bold',
                width: 16,
                height: 16,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <button className="btn-icon btn-ghost" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* ÁREA DE SCROLL (PÁGINAS) */}
      <main className="mobile-content">
        <Outlet />
      </main>

      {/* BOTTOM NAV BAR */}
      <nav className="mobile-bottom-nav">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="mobile-nav-icon">
              <item.icon size={24} />
            </div>
            <span className="mobile-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

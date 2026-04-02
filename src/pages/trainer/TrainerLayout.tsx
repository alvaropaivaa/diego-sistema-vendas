import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Users, Dumbbell, Salad, ClipboardCheck,
  MessageSquare, FileText, DollarSign, Settings, LogOut, Menu, X
} from 'lucide-react';

const navItems = [
  { to: '/trainer/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/trainer/clientes', icon: Users, label: 'Clientes' },
  { to: '/trainer/treinos', icon: Dumbbell, label: 'Treinos' },
  { to: '/trainer/dietas', icon: Salad, label: 'Dietas' },
  { to: '/trainer/checkins', icon: ClipboardCheck, label: 'Check-ins' },
  { to: '/trainer/mensagens', icon: MessageSquare, label: 'Mensagens' },
  { to: '/trainer/anamnese', icon: FileText, label: 'Anamnese' },
  { to: '/trainer/financeiro', icon: DollarSign, label: 'Financeiro' },
  { to: '/trainer/ajustes', icon: Settings, label: 'Ajustes' },
];

export default function TrainerLayout() {
  const { user, logout, loginTime } = useAuth();
  const navigate = useNavigate();
  const [clock, setClock] = useState('');
  const [sessionTime, setSessionTime] = useState('00:00:00');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setClock(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      if (loginTime) {
        const [h, m, s] = loginTime.split(':').map(Number);
        const loginDate = new Date();
        loginDate.setHours(h, m, s, 0);
        const diff = Math.max(0, Math.floor((now.getTime() - loginDate.getTime()) / 1000));
        const hours = String(Math.floor(diff / 3600)).padStart(2, '0');
        const mins = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
        const secs = String(diff % 60).padStart(2, '0');
        setSessionTime(`${hours}:${mins}:${secs}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [loginTime]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-layout">
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-img">
            <img src="/logo.png" alt="Team Haubricht" />
          </div>
          <div className="sidebar-brand">
            <h2>Team Haubricht</h2>
            <span>Trainer Portal</span>
          </div>
          <button
            className="btn-icon btn-ghost"
            onClick={() => setSidebarOpen(false)}
            style={{ display: 'none', marginLeft: 'auto' }}
          >
            <X size={18} />
          </button>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="btn-icon btn-ghost"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{ display: 'none' }}
            >
              <Menu size={18} />
            </button>
            <div className="topbar-session">
              SESSÃO: <span>{sessionTime}</span>
            </div>
          </div>
          <div className="topbar-right">
            <div className="topbar-clock">{clock}</div>
            <div className="topbar-user">
              <div className="topbar-user-avatar">
                {user?.nome?.charAt(0) || 'D'}
              </div>
              <span className="topbar-user-name">{user?.nome || 'Diego Haubricht'}</span>
            </div>
            <button className="topbar-logout" onClick={handleLogout} title="Sair">
              <LogOut size={18} />
            </button>
          </div>
        </header>
        <div className="page-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

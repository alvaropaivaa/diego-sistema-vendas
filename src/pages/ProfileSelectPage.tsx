import { useNavigate } from 'react-router-dom';
import { Shield, User, ArrowRight } from 'lucide-react';

export default function ProfileSelectPage() {
  const navigate = useNavigate();

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-logo-img">
          <img src="/logo.png" alt="Logo" />
        </div>
        <h1 className="profile-title">Team Haubricht</h1>
        <div className="profile-divider" />
        <p className="profile-subtitle">Selecione seu perfil</p>

        <div
          className="profile-card animate-fadeInUp stagger-1"
          onClick={() => navigate('/login/trainer')}
        >
          <div className="profile-card-icon">
            <Shield />
          </div>
          <div className="profile-card-info">
            <h3>Personal Trainer</h3>
            <p>Gerencie seus alunos e treinos</p>
          </div>
          <ArrowRight size={18} className="profile-card-arrow" />
        </div>

        <div
          className="profile-card animate-fadeInUp stagger-2"
          onClick={() => navigate('/login/aluno')}
        >
          <div className="profile-card-icon">
            <User />
          </div>
          <div className="profile-card-info">
            <h3>Aluno</h3>
            <p>Acompanhe seus treinos e dieta</p>
          </div>
          <ArrowRight size={18} className="profile-card-arrow" />
        </div>
      </div>
    </div>
  );
}

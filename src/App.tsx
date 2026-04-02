import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import ProfileSelectPage from './pages/ProfileSelectPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TrainerLayout from './pages/trainer/TrainerLayout';
import Dashboard from './pages/trainer/Dashboard';
import Clientes from './pages/trainer/Clientes';
import Treinos from './pages/trainer/Treinos';
import Dietas from './pages/trainer/Dietas';
import Checkins from './pages/trainer/Checkins';
import Mensagens from './pages/trainer/Mensagens';
import Anamnese from './pages/trainer/Anamnese';
import Financeiro from './pages/trainer/Financeiro';
import Ajustes from './pages/trainer/Ajustes';
import AlunoLayout from './pages/aluno/AlunoLayout';
import AlunoDashboard from './pages/aluno/AlunoDashboard';
import AlunoTreinos from './pages/aluno/AlunoTreinos';
import AlunoDietas from './pages/aluno/AlunoDietas';
import AlunoCheckins from './pages/aluno/AlunoCheckins';
import AlunoMensagens from './pages/aluno/AlunoMensagens';
import AlunoCheckinAnamnese from './pages/aluno/CheckinAnamnese';
import AnamneseIntuitiva from './pages/aluno/AnamneseIntuitiva';

function ProtectedRoute({ children, tipo }: { children: React.ReactNode; tipo: 'trainer' | 'aluno' }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (user?.tipo !== tipo) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<ProfileSelectPage />} />
      <Route path="/login/:tipo" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/aluno/anamnese-inicial" element={<AnamneseIntuitiva />} />

      {/* Trainer Routes */}
      <Route
        path="/trainer"
        element={
          <ProtectedRoute tipo="trainer">
            <TrainerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clientes" element={<Clientes />} />
        <Route path="treinos" element={<Treinos />} />
        <Route path="dietas" element={<Dietas />} />
        <Route path="checkins" element={<Checkins />} />
        <Route path="mensagens" element={<Mensagens />} />
        <Route path="anamnese" element={<Anamnese />} />
        <Route path="financeiro" element={<Financeiro />} />
        <Route path="ajustes" element={<Ajustes />} />
      </Route>

      {/* Aluno Routes */}
      <Route
        path="/aluno"
        element={
          <ProtectedRoute tipo="aluno">
            <AlunoLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AlunoDashboard />} />
        <Route path="treinos" element={<AlunoTreinos />} />
        <Route path="dietas" element={<AlunoDietas />} />
        <Route path="checkins" element={<AlunoCheckins />} />
        <Route path="anamnese" element={<AlunoCheckinAnamnese />} />
        <Route path="mensagens" element={<AlunoMensagens />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;

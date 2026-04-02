import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';

interface AuthUser {
  tipo: 'trainer' | 'aluno';
  nome: string;
  id: string;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (tipo: 'trainer' | 'aluno', nome: string, id?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loginTime: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = sessionStorage.getItem('th_auth');
    return saved ? JSON.parse(saved) : null;
  });
  const [loginTime, setLoginTime] = useState<string>(() => {
    return sessionStorage.getItem('th_login_time') || '';
  });

  useEffect(() => {
    if (user) {
      sessionStorage.setItem('th_auth', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('th_auth');
      sessionStorage.removeItem('th_login_time');
    }
  }, [user]);

  const login = (tipo: 'trainer' | 'aluno', nome: string, id?: string) => {
    const now = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setLoginTime(now);
    sessionStorage.setItem('th_login_time', now);
    setUser({ tipo, nome, id: id || 'trainer' });
  };

  const logout = () => {
    setUser(null);
    setLoginTime('');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, loginTime }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return context;
}

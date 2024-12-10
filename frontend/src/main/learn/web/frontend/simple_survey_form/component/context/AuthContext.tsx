import * as React from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string;
  login: (role: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [role, setRole] = React.useState(() => {
    return localStorage.getItem('role') || '';
  });

  const login = (role: string) => {
    setIsAuthenticated(true);
    setRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('role', role);
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole('');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('role');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

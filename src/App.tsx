import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api/axios';
import AppLayout from './components/AppLayout';
import { LeadsPage } from './pages/LeadsPage';
import LoginPage from './pages/LoginPage';
import UsersAdminPage from './pages/UsersAdminPage';
import RegisterUserPage from './pages/RegisterUserPage';
import { InternalChatPage } from './pages/InternalChatPage';
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

function RequireAuth({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [valid, setValid] = useState<null | boolean>(null);
  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setValid(false);
        return;
      }
      try {
        await api.post('/auth/validate');
        setValid(true);
      } catch {
        setValid(false);
      }
    };
    checkToken();
  }, []);

  if (valid === null) {
    return <div style={{textAlign:'center',marginTop:'2rem'}}>Validando sessão...</div>;
  }
  if (!valid) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return <>{children}</>;
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <RequireAuth>
                <AppLayout>
                  <Routes>
                    <Route path="/leads" element={<LeadsPage />} />
                    <Route path="/users" element={<UsersAdminPage />} />
                    <Route path="/register" element={<RegisterUserPage />} />
                    <Route path="/chat" element={<InternalChatPage />} />
                    <Route path="*" element={<Navigate to="/leads" replace />} />
                  </Routes>
                </AppLayout>
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
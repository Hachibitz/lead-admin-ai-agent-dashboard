import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export default function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    navigate('/login', { replace: true });
  };
  return (
    <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
      Sair
    </Button>
  );
}

import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Divider, Box } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TableChartIcon from '@mui/icons-material/TableChart';
import { useNavigate, useLocation } from 'react-router-dom';
import ForumIcon from '@mui/icons-material/Forum';

export const drawerWidth = 240; // Exportando a variável

const menuItems = [
  {
    label: 'Leads',
    icon: <TableChartIcon />,
    path: '/leads',
    adminOnly: false,
  },
  {
    label: 'Chat Interno',
    icon: <ForumIcon />,
    path: '/chat',
    adminOnly: false,
  },
  {
    label: 'Usuários',
    icon: <PeopleIcon />,
    path: '/users',
    adminOnly: true,
  },
  {
    label: 'Registro',
    icon: <PersonAddIcon />,
    path: '/register',
    adminOnly: true,
  },
];

function isAdmin() {
  try {
    const role = localStorage.getItem('userRole');
    return role === 'ADMIN';
  } catch {
    return false;
  }
}

interface SideMenuProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

export default function SideMenu({ mobileOpen, handleDrawerToggle }: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const admin = isAdmin();

  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.filter(item => !item.adminOnly || admin).map(item => (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                selected={location.pathname.startsWith(item.path)}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Box>
    </div>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="mailbox folders"
    >
      {/* Menu para telas pequenas (temporário) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>
      
      {/* Menu para telas grandes (permanente) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}
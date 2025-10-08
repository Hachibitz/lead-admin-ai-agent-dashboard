import React, { useState } from 'react';
import { Box, AppBar, Toolbar, IconButton, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutButton from './LogoutButton';
import SideMenu, { drawerWidth } from './SideMenu'; // Importando a largura do menu

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          // Em telas grandes (md), a AppBar se ajusta à largura do menu lateral
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            // O botão só aparece em telas pequenas (abaixo de md)
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Painel de Controle
          </Typography>
          <LogoutButton />
        </Toolbar>
      </AppBar>
      
      <SideMenu 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      
      <Box 
        component="main" 
        sx={{ flexGrow: 1, p: 3, width: { md: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar /> {/* Espaçador para o conteúdo não ficar sob a AppBar */}
        {children}
      </Box>
    </Box>
  );
}
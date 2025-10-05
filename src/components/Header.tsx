'use client';

import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Divider
} from '@mui/material';
import { 
  AudioLines, 
  Menu as MenuIcon,
  User,
  Settings,
  LogOut,
  Upload,
  MessageCircle,
  BarChart3
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleMenuClose();
    router.push('/');
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    background: 'rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <AudioLines size={24} color="white" />
                </Box>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    color: 'white',
                    display: { xs: 'none', sm: 'block' }
                  }}
                >
                  Clarity Audio
                </Typography>
              </Box>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
            {user ? (
              <>
                <Button
                  component={Link}
                  href="/dashboard"
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  href="/upload"
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  Upload
                </Button>
                <Button
                  component={Link}
                  href="/chat"
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  Chat IA
                </Button>
                <Button
                  component={Link}
                  href="/analytics"
                  sx={{ color: 'white', fontWeight: 500 }}
                >
                  Análises
                </Button>
                
                {/* User Menu */}
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    ml: 2,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255, 255, 255, 0.2)' }}>
                    <User size={16} />
                  </Avatar>
                </IconButton>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      {user.first_name || user.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => { router.push('/profile'); handleMenuClose(); }}>
                    <Settings size={16} style={{ marginRight: 8 }} />
                    Configurações
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogOut size={16} style={{ marginRight: 8 }} />
                    Sair
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  href="/login"
                  sx={{ 
                    color: 'white', 
                    fontWeight: 500,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Entrar
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  variant="contained"
                  sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  Cadastrar
                </Button>
              </>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              onClick={handleMobileMenuToggle}
              sx={{ color: 'white' }}
            >
              <MenuIcon size={24} />
            </IconButton>
          </Box>
        </Toolbar>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <Box sx={{ 
            display: { xs: 'block', md: 'none' },
            pb: 2,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            {user ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
                <Button
                  component={Link}
                  href="/dashboard"
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<BarChart3 size={20} />}
                >
                  Dashboard
                </Button>
                <Button
                  component={Link}
                  href="/upload"
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<Upload size={20} />}
                >
                  Upload
                </Button>
                <Button
                  component={Link}
                  href="/chat"
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<MessageCircle size={20} />}
                >
                  Chat IA
                </Button>
                <Divider sx={{ my: 1, borderColor: 'rgba(255, 255, 255, 0.2)' }} />
                <Button
                  onClick={() => { router.push('/profile'); setMobileMenuOpen(false); }}
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<Settings size={20} />}
                >
                  Configurações
                </Button>
                <Button
                  onClick={handleLogout}
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                  startIcon={<LogOut size={20} />}
                >
                  Sair
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, px: 2 }}>
                <Button
                  component={Link}
                  href="/login"
                  sx={{ color: 'white', justifyContent: 'flex-start', py: 1.5 }}
                >
                  Entrar
                </Button>
                <Button
                  component={Link}
                  href="/register"
                  sx={{ 
                    color: 'white', 
                    justifyContent: 'flex-start', 
                    py: 1.5,
                    background: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  Cadastrar
                </Button>
              </Box>
            )}
          </Box>
        )}
      </Container>
    </AppBar>
  );
}

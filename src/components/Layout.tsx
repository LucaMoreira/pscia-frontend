'use client';

import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function Layout({ 
  children, 
  showHeader = true, 
  showFooter = true 
}: LayoutProps) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
      }}
    >
      {showHeader && <Header />}
      
      <Box component="main" sx={{ flexGrow: 1 }}>
        {children}
      </Box>
      
      {showFooter && <Footer />}
    </Box>
  );
}

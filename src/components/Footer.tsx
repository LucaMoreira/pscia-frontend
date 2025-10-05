'use client';

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Link as MuiLink,
  IconButton,
  Divider,
  Stack
} from '@mui/material';
import { 
  AudioLines, 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1f2937 0%, #374151 100%)',
        color: 'white',
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <AudioLines size={24} color="white" />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                    Clarity Audio
                  </Typography>
                </Box>
              </Link>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 3, lineHeight: 1.6 }}>
                Transformando áudio em texto e insights com inteligência artificial. 
                Nossa plataforma oferece transcrição precisa e análise avançada para 
                otimizar seu fluxo de trabalho.
              </Typography>
              
              {/* Social Links */}
              <Stack direction="row" spacing={1}>
                <IconButton
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#3b82f6' }
                  }}
                >
                  <Facebook size={20} />
                </IconButton>
                <IconButton
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#3b82f6' }
                  }}
                >
                  <Twitter size={20} />
                </IconButton>
                <IconButton
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#3b82f6' }
                  }}
                >
                  <Linkedin size={20} />
                </IconButton>
                <IconButton
                  sx={{ 
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&:hover': { color: '#3b82f6' }
                  }}
                >
                  <Instagram size={20} />
                </IconButton>
              </Stack>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Links Rápidos
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                href="/dashboard"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Dashboard
              </MuiLink>
              <MuiLink
                component={Link}
                href="/upload"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Upload de Áudio
              </MuiLink>
              <MuiLink
                component={Link}
                href="/chat"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Chat com IA
              </MuiLink>
              <MuiLink
                component={Link}
                href="/analytics"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Análises
              </MuiLink>
            </Stack>
          </Grid>

          {/* Company */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Empresa
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                href="/about"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Sobre Nós
              </MuiLink>
              <MuiLink
                component={Link}
                href="/pricing"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Preços
              </MuiLink>
              <MuiLink
                component={Link}
                href="/contact"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Contato
              </MuiLink>
              <MuiLink
                component={Link}
                href="/careers"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Carreiras
              </MuiLink>
            </Stack>
          </Grid>

          {/* Legal */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Legal
            </Typography>
            <Stack spacing={1}>
              <MuiLink
                component={Link}
                href="/privacy"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Política de Privacidade
              </MuiLink>
              <MuiLink
                component={Link}
                href="/terms"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Termos de Serviço
              </MuiLink>
              <MuiLink
                component={Link}
                href="/cookies"
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.7)',
                  textDecoration: 'none',
                  '&:hover': { color: '#3b82f6' }
                }}
              >
                Política de Cookies
              </MuiLink>
            </Stack>
          </Grid>

          {/* Contact */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: 'white' }}>
              Contato
            </Typography>
            <Stack spacing={1}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  contato@clarityaudio.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  +55 (11) 99999-9999
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <MapPin size={16} color="rgba(255, 255, 255, 0.7)" />
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  São Paulo, SP - Brasil
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />

        {/* Copyright */}
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
            &copy; {new Date().getFullYear()} Clarity Audio. Todos os direitos reservados.
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.5)', mt: 1 }}>
            Feito com ❤️ para transformar a forma como você trabalha com áudio.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
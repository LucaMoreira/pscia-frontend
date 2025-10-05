'use client';

import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { 
  Upload, 
  MessageCircle, 
  BarChart3, 
  FileAudio, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Users,
  Zap,
  Shield,
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';

export default function DashboardPage() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-clarity-blue mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const quickActions = [
    {
      title: 'Transcrição de Áudio',
      description: 'Converta seus arquivos de áudio em texto com precisão',
      icon: Upload,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      action: () => router.push('/upload'),
      primary: true,
    },
    {
      title: 'Chat com IA',
      description: 'Converse com IA sobre seus áudios e obtenha insights',
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      action: () => router.push('/chat'),
    },
    {
      title: 'Análises Avançadas',
      description: 'Analise sentimentos e extraia insights valiosos',
      icon: BarChart3,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      action: () => router.push('/analytics'),
    },
  ];

  const stats = [
    { label: 'Arquivos Processados', value: '12', icon: FileAudio, color: 'text-blue-600' },
    { label: 'Tempo Economizado', value: '4.2h', icon: Clock, color: 'text-green-600' },
    { label: 'Precisão Média', value: '98.5%', icon: CheckCircle, color: 'text-purple-600' },
    { label: 'Conversas com IA', value: '8', icon: MessageCircle, color: 'text-orange-600' },
  ];

  const recentActivity = [
    { action: 'Arquivo processado', file: 'reunião_equipe.mp3', time: '2 min atrás', status: 'completed' },
    { action: 'Chat iniciado', file: 'entrevista_cliente.wav', time: '15 min atrás', status: 'active' },
    { action: 'Análise concluída', file: 'apresentação_produto.m4a', time: '1 hora atrás', status: 'completed' },
  ];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Bem-vindo de volta, {user.first_name || user.email.split('@')[0]}! 👋
              </h1>
              <p className="text-gray-600">
                Aqui está um resumo da sua atividade no Clarity Audio
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Badge className="clarity-gradient text-white border-0">
                <User className="h-3 w-3 mr-1" />
                {user.is_tester ? 'Beta Tester' : 'Usuário'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="clarity-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color.replace('text-', 'bg-').replace('-600', '-50')}`}>
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card key={index} className="clarity-card clarity-hover group cursor-pointer" onClick={action.action}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl ${action.bgColor} group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className={`h-6 w-6 ${action.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {action.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4">
                          {action.description}
                        </p>
                        <Button 
                          className={action.primary ? 'clarity-button-primary' : 'clarity-button-secondary'}
                          size="small"
                        >
                          {action.primary ? 'Começar Agora' : 'Acessar'}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card className="clarity-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-clarity-blue" />
                Atividade Recente
              </CardTitle>
              <CardDescription>
                Suas últimas ações na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-xs text-gray-500">
                        {activity.file} • {activity.time}
                      </p>
                    </div>
                    <Badge 
                      variant="outlined" 
                      className={activity.status === 'completed' ? 'status-success' : 'status-info'}
                    >
                      {activity.status === 'completed' ? 'Concluído' : 'Ativo'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card className="clarity-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-clarity-blue" />
                Informações da Conta
              </CardTitle>
              <CardDescription>
                Detalhes do seu perfil
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Email</span>
                  <span className="text-sm text-gray-900">{user.email}</span>
                </div>
                {user.username && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Username</span>
                    <span className="text-sm text-gray-900">@{user.username}</span>
                  </div>
                )}
                {user.first_name && (
                  <div className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">Nome</span>
                    <span className="text-sm text-gray-900">{user.first_name} {user.last_name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Membro desde</span>
                  <span className="text-sm text-gray-900">
                    {new Date(user.date_joined).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm font-medium text-gray-600">Status</span>
                  <Badge className={user.is_tester ? 'status-warning' : 'status-success'}>
                    {user.is_tester ? 'Beta Tester' : 'Usuário Ativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

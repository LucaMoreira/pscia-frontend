'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  MessageCircle, 
  FileAudio, 
  Bot, 
  User,
  ArrowLeft,
  Plus
} from 'lucide-react';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    startConversation, 
    loadConversations, 
    getConversation,
    conversations,
    isLoading, 
    error, 
    clearError
  } = useAudio();
  
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const audioFileId = searchParams.get('audio');

  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    try {
      setIsSending(true);
      clearError();
      
      const conversation = await startConversation(
        message,
        currentConversation?.id,
        audioFileId ? parseInt(audioFileId) : undefined
      );
      
      setCurrentConversation(conversation);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const selectConversation = async (conversationId: number) => {
    try {
      const conversation = await getConversation(conversationId);
      setCurrentConversation(conversation);
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setMessage('');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Conversas</h2>
              <Button
                size="sm"
                onClick={startNewConversation}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Nova
              </Button>
            </div>
            {audioFileId && (
              <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
                <FileAudio className="h-4 w-4 text-blue-500" />
                <span className="text-sm text-blue-700">Contexto de áudio ativo</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <MessageCircle className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">Nenhuma conversa ainda</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      currentConversation?.id === conversation.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 truncate">
                      {conversation.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {conversation.message_count} mensagem(s)
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(conversation.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Chat */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.back()}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">
                    {currentConversation ? currentConversation.title : 'Nova Conversa'}
                  </h1>
                  <p className="text-sm text-gray-500">
                    {currentConversation 
                      ? `${currentConversation.message_count} mensagem(s)`
                      : 'Comece uma nova conversa com a IA'
                    }
                  </p>
                </div>
              </div>
              
              {audioFileId && (
                <Badge variant="outline" className="text-blue-600 border-blue-600">
                  <FileAudio className="h-3 w-3 mr-1" />
                  Contexto de áudio
                </Badge>
              )}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {!currentConversation ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bem-vindo ao Chat com IA
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Faça perguntas sobre seus áudios ou converse sobre qualquer tópico
                  </p>
                  <p className="text-sm text-gray-400">
                    Digite sua mensagem abaixo para começar
                  </p>
                </div>
              </div>
            ) : (
              currentConversation.messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-900'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {msg.role === 'assistant' && (
                        <Bot className="h-4 w-4 mt-1 text-gray-400" />
                      )}
                      {msg.role === 'user' && (
                        <User className="h-4 w-4 mt-1 text-blue-100" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        <p className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                        }`}>
                          {new Date(msg.created_at).toLocaleTimeString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite sua mensagem..."
                disabled={isSending}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSending}
              >
                {isSending ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


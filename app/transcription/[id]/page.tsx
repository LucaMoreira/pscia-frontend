'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Copy, 
  Download, 
  MessageCircle, 
  BarChart3, 
  FileAudio,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function TranscriptionPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const { 
    getTranscription, 
    analyzeAudio, 
    getAudioAnalyses,
    isLoading, 
    error, 
    clearError,
    formatFileSize,
    formatDuration
  } = useAudio();
  
  const [transcription, setTranscription] = useState<any>(null);
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const audioFileId = parseInt(params.id as string);

  useEffect(() => {
    if (audioFileId && user) {
      loadTranscription();
    }
  }, [audioFileId, user]);

  const loadTranscription = async () => {
    try {
      clearError();
      const trans = await getTranscription(audioFileId);
      setTranscription(trans);
      
      // Load existing analyses
      const existingAnalyses = await getAudioAnalyses(audioFileId);
      setAnalyses(existingAnalyses);
    } catch (error) {
      console.error('Error loading transcription:', error);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const downloadTranscription = () => {
    if (!transcription) return;
    
    const element = document.createElement('a');
    const file = new Blob([transcription.text], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `transcricao_${transcription.audio_file.file_name}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const runAnalysis = async (analysisType: string) => {
    try {
      setIsAnalyzing(true);
      const analysis = await analyzeAudio(audioFileId, analysisType as any);
      setAnalyses(prev => [analysis, ...prev]);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAnalysisIcon = (type: string) => {
    switch (type) {
      case 'sentiment':
        return '😊';
      case 'keywords':
        return '🔑';
      case 'summary':
        return '📝';
      case 'topics':
        return '🏷️';
      default:
        return '📊';
    }
  };

  const getAnalysisTitle = (type: string) => {
    switch (type) {
      case 'sentiment':
        return 'Análise de Sentimento';
      case 'keywords':
        return 'Palavras-chave';
      case 'summary':
        return 'Resumo';
      case 'topics':
        return 'Tópicos';
      default:
        return 'Análise';
    }
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando transcrição...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Alert severity="error">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (!transcription) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <FileAudio className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Transcrição não encontrada</h2>
            <p className="text-gray-600 mb-4">A transcrição solicitada não foi encontrada.</p>
            <Button onClick={() => router.push('/upload')}>
              Voltar para Upload
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="outlined"
              size="small"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transcrição</h1>
              <p className="text-gray-600">{transcription.audio_file.file_name}</p>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outlined"
              onClick={() => copyToClipboard(transcription.text)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar
            </Button>
            <Button
              variant="outlined"
              onClick={downloadTranscription}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button
              onClick={() => router.push(`/chat?audio=${audioFileId}`)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Conversar com IA
            </Button>
          </div>
        </div>

        {/* File Info */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileAudio className="h-8 w-8 text-blue-500" />
                <div>
                  <h3 className="font-medium text-gray-900">{transcription.audio_file.file_name}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(transcription.audio_file.file_size)}</span>
                    {transcription.audio_file.duration && (
                      <span>{formatDuration(transcription.audio_file.duration)}</span>
                    )}
                    <span>{new Date(transcription.audio_file.uploaded_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="outlined" className="text-green-600 border-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Concluído
                </Badge>
                {transcription.confidence && (
                  <Badge variant="outlined">
                    {Math.round(transcription.confidence * 100)}% confiança
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Transcription */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Transcrição do Áudio</CardTitle>
                <CardDescription>
                  Texto extraído do arquivo de áudio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea />
              </CardContent>
            </Card>
          </div>

          {/* Analysis Panel */}
          <div className="space-y-6">
            {/* Analysis Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Análises de IA
                </CardTitle>
                <CardDescription>
                  Analise o conteúdo com inteligência artificial
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant="outlined"
                  onClick={() => runAnalysis('sentiment')}
                  disabled={isAnalyzing}
                >
                  😊 Análise de Sentimento
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outlined"
                  onClick={() => runAnalysis('keywords')}
                  disabled={isAnalyzing}
                >
                  🔑 Palavras-chave
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outlined"
                  onClick={() => runAnalysis('summary')}
                  disabled={isAnalyzing}
                >
                  📝 Resumo
                </Button>
                <Button
                  className="w-full justify-start"
                  variant="outlined"
                  onClick={() => runAnalysis('topics')}
                  disabled={isAnalyzing}
                >
                  🏷️ Tópicos
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {analyses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Resultados das Análises</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analyses.map((analysis, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getAnalysisIcon(analysis.analysis_type)}</span>
                        <h4 className="font-medium">{getAnalysisTitle(analysis.analysis_type)}</h4>
                      </div>
                      <div className="text-sm text-gray-600">
                        {typeof analysis.result === 'string' ? (
                          <p>{analysis.result}</p>
                        ) : (
                          <pre className="whitespace-pre-wrap">
                            {JSON.stringify(analysis.result, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useAudio } from '@/hooks/useAudio';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, FileAudio, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function UploadPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { 
    audioFiles, 
    uploadAudio, 
    loadAudioFiles, 
    isLoading, 
    error, 
    clearError,
    formatFileSize,
    formatDuration,
    getStatusColor,
    getStatusText
  } = useAudio();
  const router = useRouter();
  const [uploadProgress, setUploadProgress] = useState(0);

  // Redirect if not authenticated
  if (!authLoading && !user) {
    router.push('/login');
    return null;
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    clearError();
    
    for (const file of acceptedFiles) {
      try {
        setUploadProgress(0);
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 90) {
              clearInterval(progressInterval);
              return 90;
            }
            return prev + 10;
          });
        }, 200);

        await uploadAudio(file);
        setUploadProgress(100);
        
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
        
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  }, [uploadAudio, clearError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'audio/*': ['.mp3', '.wav', '.m4a', '.ogg', '.wma']
    },
    maxSize: 100 * 1024 * 1024, // 100MB
    multiple: true
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
      case 'uploading':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Upload de Áudio</h1>
          <p className="text-gray-600">Faça upload de seus arquivos de áudio para transcrição e análise</p>
        </header>

        {error && (
          <Alert severity="error" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Upload Area */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Arraste e solte seus arquivos de áudio</CardTitle>
            <CardDescription>
              Formatos suportados: MP3, WAV, M4A, OGG, WMA (máximo 100MB)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-300 hover:border-primary hover:bg-primary/5'
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg text-primary">Solte os arquivos aqui...</p>
              ) : (
                <div>
                  <p className="text-lg text-gray-600 mb-2">
                    Arraste arquivos de áudio aqui ou clique para selecionar
                  </p>
                  <Button variant="outlined">Selecionar Arquivos</Button>
                </div>
              )}
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Enviando arquivo...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Audio Files List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Seus Arquivos de Áudio</CardTitle>
                <CardDescription>
                  {audioFiles.length} arquivo(s) enviado(s)
                </CardDescription>
              </div>
              <Button 
                onClick={loadAudioFiles} 
                variant="outlined"
                disabled={isLoading}
              >
                Atualizar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {audioFiles.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileAudio className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>Nenhum arquivo de áudio enviado ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {audioFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <FileAudio className="h-8 w-8 text-blue-500" />
                      <div>
                        <h3 className="font-medium text-gray-900">{file.file_name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{formatFileSize(file.file_size)}</span>
                          {file.duration && (
                            <span>{formatDuration(file.duration)}</span>
                          )}
                          <span>{new Date(file.uploaded_at).toLocaleDateString('pt-BR')}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Badge 
                        variant="outlined" 
                        className={`${getStatusColor(file.status)} border-current`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(file.status)}
                          <span>{getStatusText(file.status)}</span>
                        </div>
                      </Badge>
                      
                      {file.status === 'completed' && (
                        <Button
                          size="small"
                          onClick={() => router.push(`/transcription/${file.id}`)}
                        >
                          Ver Transcrição
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
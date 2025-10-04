// Mock the audio service
jest.mock('@/services/audio', () => ({
  audioService: {
    uploadAudio: jest.fn(),
    getAudioFiles: jest.fn(),
    getTranscription: jest.fn(),
    startConversation: jest.fn(),
    loadConversations: jest.fn(),
    getConversation: jest.fn(),
    analyzeAudio: jest.fn(),
    getAudioAnalyses: jest.fn(),
    formatFileSize: jest.fn(),
    formatDuration: jest.fn(),
    getStatusColor: jest.fn(),
    getStatusText: jest.fn(),
  }
}));

import { renderHook, act } from '@testing-library/react';
import { useAudio } from '../useAudio';
import { audioService } from '@/services/audio';

describe('useAudio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('uploadAudio', () => {
    it('should upload audio successfully', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      const mockAudioFile = {
        id: 1,
        file_name: 'test.mp3',
        file_size: 1024,
        mime_type: 'audio/mpeg',
        uploaded_at: '2024-01-01T00:00:00Z',
        status: 'uploading' as const
      };

      (audioService.uploadAudio as jest.Mock).mockResolvedValueOnce(mockAudioFile);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.uploadAudio(mockFile, 'pt-BR');
      });

      expect((audioService as any).uploadAudio).toHaveBeenCalledWith(mockFile, 'pt-BR');
      expect(result.current.audioFiles).toContain(mockAudioFile);
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      const error = new Error('Upload failed');

      (audioService as any).uploadAudio.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        try {
          await result.current.uploadAudio(mockFile);
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Upload failed');
    });
  });

  describe('loadAudioFiles', () => {
    it('should load audio files successfully', async () => {
      const mockFiles = [
        {
          id: 1,
          file_name: 'test1.mp3',
          file_size: 1024,
          mime_type: 'audio/mpeg',
          uploaded_at: '2024-01-01T00:00:00Z',
          status: 'completed' as const
        },
        {
          id: 2,
          file_name: 'test2.mp3',
          file_size: 2048,
          mime_type: 'audio/mpeg',
          uploaded_at: '2024-01-02T00:00:00Z',
          status: 'processing' as const
        }
      ];

      (audioService as any).getAudioFiles.mockResolvedValueOnce(mockFiles);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.loadAudioFiles();
      });

      expect((audioService as any).getAudioFiles).toHaveBeenCalled();
      expect(result.current.audioFiles).toEqual(mockFiles);
    });
  });

  describe('getTranscription', () => {
    it('should get transcription successfully', async () => {
      const mockTranscription = {
        id: 1,
        audio_file: {
          id: 1,
          file_name: 'test.mp3',
          file_size: 1024,
          mime_type: 'audio/mpeg',
          uploaded_at: '2024-01-01T00:00:00Z',
          status: 'completed' as const
        },
        text: 'Esta é uma transcrição de teste',
        language: 'pt-BR',
        confidence: 0.95,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      (audioService as any).getTranscription.mockResolvedValueOnce(mockTranscription);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.getTranscription(1);
      });

      expect((audioService as any).getTranscription).toHaveBeenCalledWith(1);
      expect(result.current.transcriptions).toContain(mockTranscription);
    });
  });

  describe('startConversation', () => {
    it('should start conversation successfully', async () => {
      const mockConversation = {
        id: 1,
        title: 'Nova conversa',
        messages: [
          {
            id: 1,
            role: 'user' as const,
            content: 'Olá, como você está?',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            role: 'assistant' as const,
            content: 'Olá! Estou bem, obrigado por perguntar.',
            created_at: '2024-01-01T00:00:01Z'
          }
        ],
        message_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:01Z'
      };

      (audioService as any).startConversation.mockResolvedValueOnce(mockConversation);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.startConversation('Olá, como você está?', undefined, 1);
      });

      expect((audioService as any).startConversation).toHaveBeenCalledWith('Olá, como você está?', undefined, 1);
      expect(result.current.conversations).toContain(mockConversation);
    });
  });

  describe('loadConversations', () => {
    it('should load conversations successfully', async () => {
      const mockConversations = [
        {
          id: 1,
          title: 'Conversa 1',
          messages: [],
          message_count: 0,
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          title: 'Conversa 2',
          messages: [],
          message_count: 0,
          created_at: '2024-01-02T00:00:00Z',
          updated_at: '2024-01-02T00:00:00Z'
        }
      ];

      (audioService as any).loadConversations.mockResolvedValueOnce(mockConversations);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.loadConversations();
      });

      expect((audioService as any).loadConversations).toHaveBeenCalled();
      expect(result.current.conversations).toEqual(mockConversations);
    });
  });

  describe('analyzeAudio', () => {
    it('should analyze audio successfully', async () => {
      const mockAnalysis = {
        id: 1,
        audio_file: 1,
        analysis_type: 'sentiment' as const,
        result: {
          sentiment: 'positive',
          confidence: 0.85,
          explanation: 'Texto com sentimento positivo'
        },
        created_at: '2024-01-01T00:00:00Z'
      };

      (audioService as any).analyzeAudio.mockResolvedValueOnce(mockAnalysis);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.analyzeAudio(1, 'sentiment');
      });

      expect((audioService as any).analyzeAudio).toHaveBeenCalledWith(1, 'sentiment');
    });
  });

  describe('utility functions', () => {
    it('should provide utility functions', () => {
      (audioService as any).formatFileSize.mockReturnValue('1 KB');
      (audioService as any).formatDuration.mockReturnValue('1:30');
      (audioService as any).getStatusColor.mockReturnValue('text-green-600');
      (audioService as any).getStatusText.mockReturnValue('Concluído');

      const { result } = renderHook(() => useAudio());

      expect(result.current.formatFileSize(1024)).toBe('1 KB');
      expect(result.current.formatDuration(90)).toBe('1:30');
      expect(result.current.getStatusColor('completed')).toBe('text-green-600');
      expect(result.current.getStatusText('completed')).toBe('Concluído');
    });
  });

  describe('error handling', () => {
    it('should handle errors and set error state', async () => {
      const error = new Error('Network error');
      (audioService as any).getAudioFiles.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAudio());

      await act(async () => {
        await result.current.loadAudioFiles();
      });

      expect(result.current.error).toBe('Network error');
    });

    it('should clear error', () => {
      const { result } = renderHook(() => useAudio());

      // Set an error
      act(() => {
        result.current.error = 'Some error';
      });

      expect(result.current.error).toBe('Some error');

      // Clear error
      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });
});
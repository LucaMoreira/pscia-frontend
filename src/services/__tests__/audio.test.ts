import { audioService } from '../audio';

// Mock fetch
global.fetch = jest.fn();

// localStorage is already mocked globally in jest.setup.js
const localStorageMock = window.localStorage as any;

describe('AudioService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    // Reset localStorage mock to return undefined by default
    localStorageMock.getItem.mockReturnValue(undefined);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
  });

  describe('uploadAudio', () => {
    it('should upload audio successfully', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });
      const mockResponse = {
        id: 1,
        file_name: 'test.mp3',
        file_size: 1024,
        mime_type: 'audio/mpeg',
        uploaded_at: '2024-01-01T00:00:00Z',
        status: 'uploading'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await audioService.uploadAudio(mockFile, 'pt-BR');

      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/audio/upload/',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer access-token'
          }),
          body: expect.any(FormData)
        })
      );
    });

    it('should handle upload error', async () => {
      const mockFile = new File(['audio content'], 'test.mp3', { type: 'audio/mpeg' });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Upload failed' })
      });

      await expect(audioService.uploadAudio(mockFile))
        .rejects.toThrow('Upload failed');
    });
  });

  describe('getAudioFiles', () => {
    it('should get audio files successfully', async () => {
      const mockFiles = [
        {
          id: 1,
          file_name: 'test1.mp3',
          file_size: 1024,
          mime_type: 'audio/mpeg',
          uploaded_at: '2024-01-01T00:00:00Z',
          status: 'completed'
        },
        {
          id: 2,
          file_name: 'test2.mp3',
          file_size: 2048,
          mime_type: 'audio/mpeg',
          uploaded_at: '2024-01-02T00:00:00Z',
          status: 'processing'
        }
      ];

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockFiles)
      });

      const result = await audioService.getAudioFiles();

      expect(result).toEqual(mockFiles);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/audio/files/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer access-token'
          })
        })
      );
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
          status: 'completed'
        },
        text: 'Esta é uma transcrição de teste',
        language: 'pt-BR',
        confidence: 0.95,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTranscription)
      });

      const result = await audioService.getTranscription(1);

      expect(result).toEqual(mockTranscription);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/audio/transcription/1/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer access-token'
          })
        })
      );
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
            role: 'user',
            content: 'Olá, como você está?',
            created_at: '2024-01-01T00:00:00Z'
          },
          {
            id: 2,
            role: 'assistant',
            content: 'Olá! Estou bem, obrigado por perguntar.',
            created_at: '2024-01-01T00:00:01Z'
          }
        ],
        message_count: 2,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:01Z'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockConversation)
      });

      const result = await audioService.startConversation('Olá, como você está?', undefined, 1);

      expect(result).toEqual(mockConversation);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/audio/conversation/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            message: 'Olá, como você está?',
            conversation_id: undefined,
            audio_file_id: 1
          })
        })
      );
    });
  });

  describe('analyzeAudio', () => {
    it('should analyze audio successfully', async () => {
      const mockAnalysis = {
        id: 1,
        audio_file: 1,
        analysis_type: 'sentiment',
        result: {
          sentiment: 'positive',
          confidence: 0.85,
          explanation: 'Texto com sentimento positivo'
        },
        created_at: '2024-01-01T00:00:00Z'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAnalysis)
      });

      const result = await audioService.analyzeAudio(1, 'sentiment');

      expect(result).toEqual(mockAnalysis);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/audio/analyze/',
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify({
            audio_file_id: 1,
            analysis_type: 'sentiment'
          })
        })
      );
    });
  });

  describe('utility methods', () => {
    describe('formatFileSize', () => {
      it('should format file size correctly', () => {
        expect(audioService.formatFileSize(0)).toBe('0 Bytes');
        expect(audioService.formatFileSize(1024)).toBe('1 KB');
        expect(audioService.formatFileSize(1024 * 1024)).toBe('1 MB');
        expect(audioService.formatFileSize(1024 * 1024 * 1024)).toBe('1 GB');
      });
    });

    describe('formatDuration', () => {
      it('should format duration correctly', () => {
        expect(audioService.formatDuration(0)).toBe('0:00');
        expect(audioService.formatDuration(30)).toBe('0:30');
        expect(audioService.formatDuration(90)).toBe('1:30');
        expect(audioService.formatDuration(3661)).toBe('61:01');
      });
    });

    describe('getStatusColor', () => {
      it('should return correct status colors', () => {
        expect(audioService.getStatusColor('uploading')).toBe('text-yellow-600');
        expect(audioService.getStatusColor('processing')).toBe('text-blue-600');
        expect(audioService.getStatusColor('completed')).toBe('text-green-600');
        expect(audioService.getStatusColor('failed')).toBe('text-red-600');
        expect(audioService.getStatusColor('unknown')).toBe('text-gray-600');
      });
    });

    describe('getStatusText', () => {
      it('should return correct status texts', () => {
        expect(audioService.getStatusText('uploading')).toBe('Enviando');
        expect(audioService.getStatusText('processing')).toBe('Processando');
        expect(audioService.getStatusText('completed')).toBe('Concluído');
        expect(audioService.getStatusText('failed')).toBe('Falhou');
        expect(audioService.getStatusText('unknown')).toBe('Desconhecido');
      });
    });
  });
});

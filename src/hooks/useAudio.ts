'use client';

import { useState, useCallback } from 'react';
import { audioService, AudioFile, Transcription, Conversation, AudioAnalysis } from '@/services/audio';

export const useAudio = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const handleError = (error: any) => {
    console.error('Audio hook error:', error);
    setError(error.message || 'An error occurred');
  };

  // Audio file management
  const uploadAudio = useCallback(async (file: File, language: string = 'pt-BR') => {
    setIsLoading(true);
    clearError();
    
    try {
      const uploadedFile = await audioService.uploadAudio(file, language);
      setAudioFiles(prev => [uploadedFile, ...prev]);
      return uploadedFile;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadAudioFiles = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const files = await audioService.getAudioFiles();
      setAudioFiles(files);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTranscription = useCallback(async (audioFileId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const transcription = await audioService.getTranscription(audioFileId);
      setTranscriptions(prev => {
        const existing = prev.find(t => t.audio_file.id === audioFileId);
        if (existing) {
          return prev.map(t => t.audio_file.id === audioFileId ? transcription : t);
        }
        return [transcription, ...prev];
      });
      return transcription;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Conversation management
  const startConversation = useCallback(async (
    message: string,
    conversationId?: number,
    audioFileId?: number
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const conversation = await audioService.startConversation(message, conversationId, audioFileId);
      setConversations(prev => {
        if (conversationId) {
          return prev.map(c => c.id === conversationId ? conversation : c);
        }
        return [conversation, ...prev];
      });
      return conversation;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    clearError();
    
    try {
      const convs = await audioService.getConversations();
      setConversations(convs);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getConversation = useCallback(async (conversationId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const conversation = await audioService.getConversation(conversationId);
      setConversations(prev => {
        const existing = prev.find(c => c.id === conversationId);
        if (existing) {
          return prev.map(c => c.id === conversationId ? conversation : c);
        }
        return [conversation, ...prev];
      });
      return conversation;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Audio analysis
  const analyzeAudio = useCallback(async (
    audioFileId: number,
    analysisType: 'sentiment' | 'keywords' | 'summary' | 'topics'
  ) => {
    setIsLoading(true);
    clearError();
    
    try {
      const analysis = await audioService.analyzeAudio(audioFileId, analysisType);
      return analysis;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAudioAnalyses = useCallback(async (audioFileId: number) => {
    setIsLoading(true);
    clearError();
    
    try {
      const analyses = await audioService.getAudioAnalyses(audioFileId);
      return analyses;
    } catch (error) {
      handleError(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Utility functions
  const formatFileSize = audioService.formatFileSize;
  const formatDuration = audioService.formatDuration;
  const getStatusColor = audioService.getStatusColor;
  const getStatusText = audioService.getStatusText;

  return {
    // State
    audioFiles,
    transcriptions,
    conversations,
    isLoading,
    error,
    
    // Actions
    uploadAudio,
    loadAudioFiles,
    getTranscription,
    startConversation,
    loadConversations,
    getConversation,
    analyzeAudio,
    getAudioAnalyses,
    clearError,
    
    // Utilities
    formatFileSize,
    formatDuration,
    getStatusColor,
    getStatusText,
  };
};

// Mock the auth service
jest.mock('@/services/auth', () => ({
  authService: {
    login: jest.fn(),
    register: jest.fn(),
    logout: jest.fn(),
    getUser: jest.fn(),
    checkAuth: jest.fn(),
    isAuthenticated: jest.fn(),
  }
}));

import { renderHook, act } from '@testing-library/react';
import { useAuth, AuthProvider } from '../useAuth';
import { authService } from '@/services/auth';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <AuthProvider>{children}</AuthProvider>
  );

  describe('login', () => {
    it('should login successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        is_tester: false,
        date_joined: '2024-01-01T00:00:00Z'
      };

      (authService as any).login.mockResolvedValueOnce({
        access: 'access-token',
        refresh: 'refresh-token'
      });
      (authService as any).getUser.mockResolvedValueOnce(mockUser);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.login('test@example.com', 'password123');
      });

      expect((authService as any).login).toHaveBeenCalledWith('test@example.com', 'password123');
      expect((authService as any).getUser).toHaveBeenCalled();
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should handle login error', async () => {
      const error = new Error('Invalid credentials');
      (authService as any).login.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        try {
          await result.current.login('test@example.com', 'wrong-password');
        } catch (e) {
          // Expected to throw
        }
      });

      expect(result.current.error).toBe('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        is_tester: false,
        date_joined: '2024-01-01T00:00:00Z'
      };

      (authService as any).register.mockResolvedValueOnce({
        user: mockUser,
        access: 'access-token',
        refresh: 'refresh-token'
      });

      const { result } = renderHook(() => useAuth(), { wrapper });

      await act(async () => {
        await result.current.register(
          'test@example.com',
          'password123',
          'testuser',
          'Test',
          'User'
        );
      });

      expect((authService as any).register).toHaveBeenCalledWith(
        'test@example.com',
        'password123',
        'testuser',
        'Test',
        'User'
      );
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        is_tester: false,
        date_joined: '2024-01-01T00:00:00Z'
      };

      (authService as any).logout.mockResolvedValueOnce(undefined);

      const { result } = renderHook(() => useAuth(), { wrapper });

      // Set initial user
      act(() => {
        result.current.user = mockUser;
      });

      await act(async () => {
        await result.current.logout();
      });

      expect((authService as any).logout).toHaveBeenCalled();
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('clearError', () => {
    it('should clear error', () => {
      const { result } = renderHook(() => useAuth(), { wrapper });

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
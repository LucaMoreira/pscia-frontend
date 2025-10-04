import { authService } from '../auth';

// Mock fetch
global.fetch = jest.fn();

// localStorage is already mocked globally in jest.setup.js
const localStorageMock = window.localStorage as any;

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    // Reset localStorage mock to return undefined by default
    localStorageMock.getItem.mockReturnValue(undefined);
    localStorageMock.setItem.mockImplementation(() => {});
    localStorageMock.removeItem.mockImplementation(() => {});
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const mockResponse = {
        access: 'access-token',
        refresh: 'refresh-token'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.login('test@example.com', 'password123');

      expect(result).toEqual(mockResponse);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'refresh-token');
    });

    it('should handle login error', async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        json: () => Promise.resolve({ error: 'Invalid credentials' })
      });

      await expect(authService.login('test@example.com', 'wrong-password'))
        .rejects.toThrow('Invalid credentials');
    });
  });

  describe('register', () => {
    it('should register successfully', async () => {
      const mockResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          is_tester: false,
          date_joined: '2024-01-01T00:00:00Z'
        },
        access: 'access-token',
        refresh: 'refresh-token'
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.register(
        'test@example.com',
        'password123',
        'testuser',
        'Test',
        'User'
      );

      expect(result).toEqual(mockResponse);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('access_token', 'access-token');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('refresh_token', 'refresh-token');
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      localStorage.setItem('refresh_token', 'refresh-token');

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({})
      });

      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });

    it('should clear tokens even if logout request fails', async () => {
      localStorage.setItem('refresh_token', 'refresh-token');

      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      await authService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith('access_token');
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('getCurrentUser', () => {
    it('should get current user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        first_name: 'Test',
        last_name: 'User',
        is_tester: false,
        date_joined: '2024-01-01T00:00:00Z'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockUser)
      });

      const result = await authService.getCurrentUser();

      expect(result).toEqual(mockUser);
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8000/accounts/get_user/',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer access-token'
          })
        })
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      const mockResponse = {
        access: 'new-access-token',
        refresh: 'new-refresh-token'
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'refresh_token') return 'old-refresh-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.refreshToken();

      expect(result).toEqual(mockResponse);
      expect(localStorage.getItem('access_token')).toBe('new-access-token');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh-token');
    });

    it('should throw error when no refresh token', async () => {
      await expect(authService.refreshToken())
        .rejects.toThrow('No refresh token available');
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when access token exists', () => {
      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('should return false when no access token', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('checkAuth', () => {
    it('should check auth successfully', async () => {
      const mockResponse = {
        auth: 'Authenticated',
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
          first_name: 'Test',
          last_name: 'User',
          is_tester: false,
          date_joined: '2024-01-01T00:00:00Z'
        }
      };

      localStorageMock.getItem.mockImplementation((key) => {
        if (key === 'access_token') return 'access-token';
        return null;
      });

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await authService.checkAuth();

      expect(result).toEqual(mockResponse);
    });

    it('should return Visitor when check fails', async () => {
      (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

      const result = await authService.checkAuth();

      expect(result).toEqual({ auth: 'Visitor' });
    });
  });
});

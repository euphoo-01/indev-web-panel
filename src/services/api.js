import axios from 'axios';

// Простые функции для работы с JWT токеном
const saveToken = (token) => {
  if (!token) return false;
  try {
    localStorage.setItem('jwt_token', token);
    // Вызываем пользовательское событие, чтобы сообщить другим компонентам об изменении токена
    window.dispatchEvent(new Event('tokenChanged'));
    return true;
  } catch (err) {
    console.error('Failed to save token:', err);
    return false;
  }
};

const getToken = () => {
  try {
    return localStorage.getItem('jwt_token');
  } catch (err) {
    console.error('Failed to get token:', err);
    return null;
  }
};

const removeToken = () => {
  try {
    localStorage.removeItem('jwt_token');
    window.dispatchEvent(new Event('tokenChanged'));
  } catch (err) {
    console.error('Failed to remove token:', err);
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://80.94.168.136:8081/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth service functions
export const authService = {
  // Login function that sends credentials to the backend
  login: async (login, password) => {
    try {
      console.log('Login attempt:', { email: login });
      const response = await api.post('/auth/login', { email: login, password });
      
      // Extract token from response
      const token = response.data.token || response.data.accessToken;
      if (!token) {
        console.error('No token in response:', response.data);
        return { 
          success: false, 
          message: 'Сервер не вернул токен авторизации'
        };
      }
      
      // Save token
      if (!saveToken(token)) {
        return { 
          success: false, 
          message: 'Не удалось сохранить токен авторизации'
        };
      }
      
      // Create user object
      const user = {
        id: response.data.id || response.data.userId || 1,
        name: response.data.name || response.data.fullName || login,
        role: response.data.role || 'admin',
        login: login
      };
      
      // Save user data
      localStorage.setItem('current_user', JSON.stringify(user));
      
      return { 
        success: true, 
        user: user,
        token: token
      };
    } catch (error) {
      console.error('Login error:', error.response || error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Ошибка при входе в систему'
      };
    }
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!getToken();
  },
  
  // Logout function
  logout: () => {
    removeToken();
    localStorage.removeItem('current_user');
    return { success: true };
  },

  // Get current user data
  getCurrentUser: () => {
    const token = getToken();
    if (!token) {
      return { success: false, message: 'Не авторизован' };
    }
    
    try {
      const userJson = localStorage.getItem('current_user');
      if (userJson) {
        const user = JSON.parse(userJson);
        return { success: true, user: user };
      }
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
    
    // Default user if no data found but token exists
    return { 
      success: true,
      user: {
        id: 1,
        name: 'Пользователь',
        role: 'admin',
        login: 'user'
      }
    };
  },
};

export default api; 
import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Роли пользователей
export const ROLES = {
  ROOT: 'root',
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Проверка токена и восстановление сессии при загрузке приложения
  useEffect(() => {
    const restoreSession = () => {
      try {
        // Если токен найден
        if (authService.isAuthenticated()) {
          // Получаем данные пользователя (синхронно)
          const result = authService.getCurrentUser();
          
          if (result.success && result.user) {
            // Устанавливаем пользователя с гарантированной ролью
            const userWithRole = {
              ...result.user,
              role: result.user.role || ROLES.EMPLOYEE
            };
            
            setCurrentUser(userWithRole);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Error restoring session:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    // Восстанавливаем сессию при загрузке
    restoreSession();
    
    // Слушаем события изменения токена
    const handleTokenChange = () => {
      restoreSession();
    };
    
    window.addEventListener('tokenChanged', handleTokenChange);
    
    return () => {
      window.removeEventListener('tokenChanged', handleTokenChange);
    };
  }, []);

  // Функция авторизации
  const login = async (login, password) => {
    try {
      setIsLoading(true);
      
      // Вход в систему
      const result = await authService.login(login, password);
      
      if (result.success) {
        // Устанавливаем пользователя с гарантированной ролью
        const userWithRole = {
          ...result.user,
          role: result.user.role || ROLES.EMPLOYEE
        };
        
        setCurrentUser(userWithRole);
        setIsAuthenticated(true);
        return { success: true, user: userWithRole };
      }
      
      return { success: false, message: result.message || 'Неверный логин или пароль' };
    } catch (error) {
      console.error('Ошибка при авторизации:', error);
      return { success: false, message: 'Произошла ошибка при авторизации' };
    } finally {
      setIsLoading(false);
    }
  };

  // Функция выхода
  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Проверка прав доступа
  const hasPermission = (requiredRole) => {
    if (!currentUser) return false;
    if (!requiredRole) return true;
    
    // Если роль пользователя отсутствует, считаем что у него есть базовые права
    if (!currentUser.role) return requiredRole === ROLES.EMPLOYEE;
    
    switch (requiredRole) {
      case ROLES.EMPLOYEE:
        return [ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.ROOT].includes(currentUser.role);
      case ROLES.ADMIN:
        return [ROLES.ADMIN, ROLES.ROOT].includes(currentUser.role);
      case ROLES.ROOT:
        return currentUser.role === ROLES.ROOT;
      default:
        return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentUser, 
        isAuthenticated, 
        isLoading,
        login, 
        logout,
        hasPermission, 
        ROLES 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext; 
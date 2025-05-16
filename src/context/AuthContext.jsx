import { createContext, useState, useContext, useEffect } from 'react';

// Роли пользователей
export const ROLES = {
  ROOT: 'root',
  ADMIN: 'admin',
  EMPLOYEE: 'employee'
};

// Начальные пользователи системы
const initialUsers = [
  {
    id: 1,
    login: 'root',
    password: 'root123',
    role: ROLES.ROOT,
    name: 'Главный администратор',
  },
  {
    id: 2,
    login: 'admin',
    password: 'admin123',
    role: ROLES.ADMIN,
    name: 'Администратор',
  },
  {
    id: 3,
    login: 'employee',
    password: 'emp123',
    role: ROLES.EMPLOYEE,
    name: 'Сотрудник',
  }
];

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState(() => {
    const savedUsers = localStorage.getItem('hotel_users');
    return savedUsers ? JSON.parse(savedUsers) : initialUsers;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Сохраняем пользователей в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('hotel_users', JSON.stringify(users));
  }, [users]);

  // Функция авторизации
  const login = (login, password) => {
    const user = users.find(
      (user) => user.login === login && user.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return { success: true, user };
    }
    
    return { success: false, message: 'Неверный логин или пароль' };
  };

  // Функция выхода
  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  // Добавление нового пользователя
  const addUser = (newUser) => {
    // Проверка на права доступа
    if (!currentUser) return { success: false, message: 'Не авторизован' };
    
    // Root может добавлять любого пользователя
    if (currentUser.role === ROLES.ROOT) {
      // Проверка уникальности логина
      if (users.some(user => user.login === newUser.login)) {
        return { success: false, message: 'Пользователь с таким логином уже существует' };
      }
      
      const userWithId = {
        ...newUser,
        id: users.length + 1
      };
      
      setUsers([...users, userWithId]);
      return { success: true, user: userWithId };
    }
    
    // Admin может добавлять только сотрудников
    if (currentUser.role === ROLES.ADMIN) {
      if (newUser.role !== ROLES.EMPLOYEE) {
        return { success: false, message: 'У вас нет прав для добавления пользователя с этой ролью' };
      }
      
      // Проверка уникальности логина
      if (users.some(user => user.login === newUser.login)) {
        return { success: false, message: 'Пользователь с таким логином уже существует' };
      }
      
      const userWithId = {
        ...newUser,
        id: users.length + 1
      };
      
      setUsers([...users, userWithId]);
      return { success: true, user: userWithId };
    }
    
    return { success: false, message: 'У вас нет прав для добавления пользователей' };
  };

  // Проверка прав доступа
  const hasPermission = (requiredRole) => {
    if (!currentUser) return false;
    
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
        login, 
        logout, 
        users, 
        addUser, 
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
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './UsersManagement.css';

// Демо-пользователи для отображения
const demoUsers = [
  {
    id: 1,
    login: 'root',
    name: 'Главный администратор',
    role: 'root'
  },
  {
    id: 2,
    login: 'admin',
    name: 'Администратор',
    role: 'admin'
  },
  {
    id: 3,
    login: 'employee',
    name: 'Сотрудник',
    role: 'employee'
  }
];

export default function UsersManagement() {
  const { ROLES, hasPermission, currentUser } = useAuth();
  const [users, setUsers] = useState(demoUsers);
  const [newUser, setNewUser] = useState({
    login: '',
    password: '',
    name: '',
    role: ROLES.EMPLOYEE
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Добавляем текущего пользователя в список, если его там нет
  useEffect(() => {
    if (currentUser && !users.some(user => user.id === currentUser.id)) {
      setUsers(prevUsers => [...prevUsers, currentUser]);
    }
  }, [currentUser, users]);

  const handleInputChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
    setError('');
    setSuccess('');
  };

  const handleAddUser = () => {
    // Валидация
    if (!newUser.login || !newUser.password || !newUser.name) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    // Проверяем, не существует ли уже пользователь с таким логином
    if (users.some(user => user.login === newUser.login)) {
      setError('Пользователь с таким логином уже существует');
      return;
    }

    // Добавляем нового пользователя (демо-функционал)
    const newUserWithId = {
      ...newUser,
      id: users.length + 1,
      password: undefined // Не храним пароль в состоянии
    };

    setUsers(prevUsers => [...prevUsers, newUserWithId]);
    setSuccess(`Пользователь ${newUser.login} успешно добавлен`);
    setNewUser({
      login: '',
      password: '',
      name: '',
      role: ROLES.EMPLOYEE
    });
  };

  // Фильтруем пользователей в зависимости от роли текущего пользователя
  const displayUsers = users.filter(user => {
    if (currentUser?.role === ROLES.ROOT) {
      return true; // root видит всех
    } else if (currentUser?.role === ROLES.ADMIN) {
      return user.role !== ROLES.ROOT; // admin не видит root
    }
    return false; // остальные не видят никого
  });

  return (
    <div className="users-management">
      <header className="content-header">
        <h1>Управление персоналом</h1>
      </header>
      
      <div className="users-container">
        <div className="users-list-section">
          <h2>Список пользователей</h2>
          
          <div className="users-list">
            <div className="user-item header">
              <span className="user-id">ID</span>
              <span className="user-name">Имя</span>
              <span className="user-login">Логин</span>
              <span className="user-role">Роль</span>
            </div>
            
            {displayUsers.map(user => (
              <div className="user-item" key={user.id}>
                <span className="user-id">{user.id}</span>
                <span className="user-name">{user.name}</span>
                <span className="user-login">{user.login}</span>
                <span className={`user-role role-${user.role}`}>{user.role}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="add-user-section">
          <h2>Добавить пользователя</h2>
          
          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}
          
          <div className="add-user-form">
            <div className="form-group">
              <label>Имя пользователя</label>
              <Input
                name="name"
                inputPlaceholder="Введите имя"
                value={newUser.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Логин</label>
              <Input
                name="login"
                inputPlaceholder="Введите логин"
                value={newUser.login}
                onChange={(e) => handleInputChange('login', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Пароль</label>
              <Input
                name="password"
                type="password"
                inputPlaceholder="Введите пароль"
                value={newUser.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label>Роль</label>
              <select 
                value={newUser.role}
                onChange={(e) => handleInputChange('role', e.target.value)}
                disabled={!hasPermission(ROLES.ROOT)} // Только root может менять роль
                className="role-select"
              >
                <option value={ROLES.EMPLOYEE}>Сотрудник</option>
                <option value={ROLES.ADMIN}>Администратор</option>
                {hasPermission(ROLES.ROOT) && (
                  <option value={ROLES.ROOT}>Root</option>
                )}
              </select>
            </div>
            
            <Button
              text="Добавить пользователя"
              clickHandler={handleAddUser}
              variant="success"
              className="add-user-button"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 
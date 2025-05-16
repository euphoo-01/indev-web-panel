import { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import './ClientManagement.css';

// Примеры клиентов для демонстрации
const sampleClients = [
  { id: 1001, name: "Иванов Иван", phone: "+375 (29) 123-45-67", email: "ivanov@mail.by" },
  { id: 1002, name: "Петров Петр", phone: "+375 (33) 234-56-78", email: "petrov@mail.by" },
  { id: 1003, name: "Сидорова Анна", phone: "+375 (25) 345-67-89", email: "sidorova@mail.by" },
  { id: 1004, name: "Смирнов Алексей", phone: "+375 (44) 456-78-90", email: "smirnov@mail.by" },
];

export default function ClientManagement({ rooms, addClientToRoom }) {
  const [clients, setClients] = useState(sampleClients);
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    phone: '',
    email: ''
  });

  // Доступные (свободные) номера
  const availableRooms = rooms.filter(room => !room.occupied);
  
  // Фильтрация клиентов по имени
  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (field, value) => {
    setNewClient(prev => ({ ...prev, [field]: value }));
  };

  const handleAddClient = () => {
    // Валидация
    if (!newClient.name || !newClient.phone) {
      setError('Имя и телефон обязательны');
      return;
    }
    
    // Создаем нового клиента
    const clientId = 1000 + clients.length + 1;
    const client = {
      id: clientId,
      name: newClient.name,
      phone: newClient.phone,
      email: newClient.email || '-'
    };
    
    setClients([...clients, client]);
    setSuccess(`Клиент ${client.name} успешно добавлен`);
    setNewClient({ name: '', phone: '', email: '' });
    
    // Выбираем нового клиента после его создания
    setSelectedClient(client);
    setError('');
  };

  const handleAssignRoom = () => {
    if (!selectedClient) {
      setError('Выберите клиента');
      return;
    }
    
    if (!selectedRoom) {
      setError('Выберите номер');
      return;
    }
    
    const roomId = parseInt(selectedRoom);
    
    // Проверяем, что номер существует и свободен
    const room = rooms.find(r => r.id === roomId);
    if (!room) {
      setError('Номер не найден');
      return;
    }
    
    if (room.occupied) {
      setError('Этот номер уже занят');
      return;
    }
    
    // Добавляем клиента в номер
    addClientToRoom(roomId, selectedClient.id);
    setSuccess(`Клиент ${selectedClient.name} заселен в номер ${room.number}`);
    setSelectedClient(null);
    setSelectedRoom('');
  };

  return (
    <div className="client-management">
      <header className="content-header">
        <div className="container">
          <h1>Управление клиентами</h1>
        </div>
      </header>
      
      <div className="container">
        <div className="client-container">
          <div className="clients-list-section modern-card">
            <div className="section-header">
              <h2>Список клиентов</h2>
              <div className="search-container">
                <Input
                  name="searchClient"
                  inputPlaceholder="Поиск клиента по имени..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    className="clear-search"
                    onClick={() => setSearchQuery('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            <div className="clients-list">
              <div className="client-item header">
                <span className="client-id">ID</span>
                <span className="client-name">Имя</span>
                <span className="client-phone">Телефон</span>
                <span className="client-email">Email</span>
                <span className="client-select"></span>
              </div>
              
              {filteredClients.length > 0 ? (
                filteredClients.map(client => (
                  <div 
                    className={`client-item ${selectedClient?.id === client.id ? 'selected' : ''}`} 
                    key={client.id}
                  >
                    <span className="client-id">{client.id}</span>
                    <span className="client-name">{client.name}</span>
                    <span className="client-phone">{client.phone}</span>
                    <span className="client-email">{client.email}</span>
                    <span className="client-select">
                      <Button 
                        text={selectedClient?.id === client.id ? "Выбран" : "Выбрать"} 
                        variant={selectedClient?.id === client.id ? "secondary" : "primary"}
                        clickHandler={() => setSelectedClient(selectedClient?.id === client.id ? null : client)}
                        className="select-client-btn"
                      />
                    </span>
                  </div>
                ))
              ) : (
                <div className="no-results">
                  <p>Клиенты не найдены</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="client-actions-section">
            <div className="add-client-section modern-card">
              <h2>Добавить клиента</h2>
              
              {error && <div className="form-error">{error}</div>}
              {success && <div className="form-success">{success}</div>}
              
              <div className="add-client-form">
                <div className="form-group">
                  <label>ФИО клиента</label>
                  <Input
                    name="name"
                    inputPlaceholder="Введите ФИО"
                    value={newClient.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Телефон</label>
                  <Input
                    name="phone"
                    inputPlaceholder="+375 (__) ___-__-__"
                    value={newClient.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <Input
                    name="email"
                    inputPlaceholder="example@mail.ru"
                    value={newClient.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                
                <Button
                  text="Добавить клиента"
                  clickHandler={handleAddClient}
                  variant="success"
                  className="add-client-button modern-button"
                />
              </div>
            </div>
            
            <div className="assign-room-section modern-card">
              <h2>Заселение в номер</h2>
              
              <div className="assign-form">
                <div className="form-group">
                  <label>Выбранный клиент</label>
                  <div className="selected-client-info">
                    {selectedClient ? (
                      <div className="selected-client">
                        <span className="client-name">{selectedClient.name}</span>
                        <span className="client-phone">{selectedClient.phone}</span>
                      </div>
                    ) : (
                      <div className="no-selection">Клиент не выбран</div>
                    )}
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Выберите номер</label>
                  <select 
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                    className="room-select"
                    disabled={!selectedClient}
                  >
                    <option value="">-- Выберите номер --</option>
                    {availableRooms.map(room => (
                      <option key={room.id} value={room.id}>
                        Номер {room.number} ({room.type}, {room.price} BYN)
                      </option>
                    ))}
                  </select>
                </div>
                
                <Button
                  text="Заселить клиента"
                  clickHandler={handleAssignRoom}
                  variant="primary"
                  disabled={!selectedClient || !selectedRoom}
                  className="assign-button modern-button"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
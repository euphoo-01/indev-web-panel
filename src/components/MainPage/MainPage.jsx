import { useState, useEffect } from "react";
import Room from "../Room/Room";
import Modal from "../Modal/Modal";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import UsersManagement from "../UsersManagement/UsersManagement";
import ClientManagement from "../ClientManagement/ClientManagement";
import "./MainPage.css";

// Sample data - in a real application, this would come from an API
const sampleRoomData = [
  {
    id: 1,
    number: 101,
    type: "Standard",
    occupied: false,
    lightsOn: false,
    clientId: null,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true },
    price: 3500,
    basePrice: 3000
  },
  {
    id: 2,
    number: 102,
    type: "Standard",
    occupied: true,
    lightsOn: true,
    clientId: 1001,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true },
    price: 3600,
    basePrice: 3000
  },
  {
    id: 3,
    number: 103,
    type: "Deluxe",
    occupied: true,
    lightsOn: true,
    clientId: 1002,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true, bathtub: true },
    price: 5500,
    basePrice: 5000
  },
  {
    id: 4,
    number: 104,
    type: "Suite",
    occupied: false,
    lightsOn: false,
    clientId: null,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true, bathtub: true, livingRoom: true },
    price: 8000,
    basePrice: 7500
  },
  {
    id: 5,
    number: 105,
    type: "Standard",
    occupied: false,
    lightsOn: false,
    clientId: null,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true },
    price: 3500,
    basePrice: 3000
  },
  {
    id: 6,
    number: 106,
    type: "Standard",
    occupied: true,
    lightsOn: false,
    clientId: 1003,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true },
    price: 3700,
    basePrice: 3000
  },
  {
    id: 7,
    number: 107,
    type: "Deluxe",
    occupied: false,
    lightsOn: false,
    clientId: null,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true, bathtub: true },
    price: 5200,
    basePrice: 5000
  },
  {
    id: 8,
    number: 108,
    type: "Suite",
    occupied: true,
    lightsOn: true,
    clientId: 1004,
    features: { airConditioner: true, curtains: true, miniBar: true, shower: true, bathtub: true, livingRoom: true },
    price: 8500,
    basePrice: 7500
  },
];

// Секции админ-панели
const SECTIONS = {
  ROOMS: 'rooms',
  USERS: 'users',
  CLIENTS: 'clients',
};

export default function MainPage({ pageHandler }) {
  const { isDarkMode, toggleTheme } = useTheme();
  const { currentUser, logout, hasPermission, ROLES } = useAuth();
  const [rooms, setRooms] = useState(sampleRoomData);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({ type: "all", occupied: "all", price: [0, 10000] });
  const [activeSection, setActiveSection] = useState(SECTIONS.ROOMS);
  
  // Analytics calculations
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(room => room.occupied).length;
  const occupancyRate = (occupiedRooms / totalRooms) * 100;
  const roomsWithLightsOn = rooms.filter(room => room.lightsOn).length;

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    return (filter.type === "all" || room.type === filter.type) &&
           (filter.occupied === "all" || 
            (filter.occupied === "occupied" && room.occupied) || 
            (filter.occupied === "vacant" && !room.occupied)) &&
           (room.price >= filter.price[0] && room.price <= filter.price[1]);
  });

  const handleRoomClick = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRoom(null);
  };

  const handleFilterChange = (field, value) => {
    setFilter(prev => ({ ...prev, [field]: value }));
  };

  // Добавление клиента в номер (для сотрудников)
  const addClientToRoom = (roomId, clientId) => {
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, occupied: true, clientId } 
          : room
      )
    );
  };

  // Изменение номера (для админов)
  const updateRoom = (roomId, updatedData) => {
    if (!hasPermission(ROLES.ADMIN)) return;
    
    setRooms(prevRooms => 
      prevRooms.map(room => 
        room.id === roomId 
          ? { ...room, ...updatedData } 
          : room
      )
    );
  };

  // Dynamic pricing based on occupancy
  useEffect(() => {
    const priceMultiplier = 1 + (occupancyRate / 200); // Max 50% increase at 100% occupancy
    
    setRooms(rooms.map(room => ({
      ...room,
      price: Math.round(room.basePrice * priceMultiplier)
    })));
  }, [occupancyRate]);

  const handleLogout = () => {
    logout();
    pageHandler("0");
  };

  return (
    <div className="main-page">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>InDev Hotel</h2>
        </div>
        
        <div className="user-info">
          <div className="user-avatar">{currentUser?.name[0]}</div>
          <div className="user-details">
            <span className="user-name">{currentUser?.name}</span>
            <span className="user-role">{currentUser?.role}</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeSection === SECTIONS.ROOMS ? 'active' : ''}`}
            onClick={() => setActiveSection(SECTIONS.ROOMS)}
          >
            <span className="nav-icon">🏠</span>
            <span>Номерной фонд</span>
          </button>
          
          {hasPermission(ROLES.ADMIN) && (
            <button 
              className={`nav-item ${activeSection === SECTIONS.USERS ? 'active' : ''}`}
              onClick={() => setActiveSection(SECTIONS.USERS)}
            >
              <span className="nav-icon">👥</span>
              <span>Управление персоналом</span>
            </button>
          )}
          
          {hasPermission(ROLES.EMPLOYEE) && (
            <button 
              className={`nav-item ${activeSection === SECTIONS.CLIENTS ? 'active' : ''}`}
              onClick={() => setActiveSection(SECTIONS.CLIENTS)}
            >
              <span className="nav-icon">👤</span>
              <span>Клиенты</span>
            </button>
          )}
          
          <button className="nav-item logout" onClick={handleLogout}>
            <span className="nav-icon">🚪</span>
            <span>Выйти</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <button 
            className="theme-toggle sidebar-theme-toggle" 
            onClick={toggleTheme}
            title={isDarkMode ? "Переключить на светлую тему" : "Переключить на тёмную тему"}
          >
            {isDarkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>

      <div className="main-content">
        {activeSection === SECTIONS.ROOMS && (
          <>
            <header className="content-header">
              <h1>Управление номерами</h1>
            </header>

            <div className="dashboard">
              <div className="analytics-section">
                <h2>Аналитика</h2>
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <h3>Загруженность</h3>
                    <p className="analytics-value">{occupancyRate.toFixed(1)}%</p>
                    <p>{occupiedRooms} из {totalRooms} номеров</p>
                  </div>
                  <div className="analytics-card">
                    <h3>Номера со светом</h3>
                    <p className="analytics-value">{roomsWithLightsOn}</p>
                    <p>{((roomsWithLightsOn / totalRooms) * 100).toFixed(1)}% от всех номеров</p>
                  </div>
                  <div className="analytics-card">
                    <h3>Средняя цена</h3>
                    <p className="analytics-value">
                      {Math.round(rooms.reduce((sum, room) => sum + room.price, 0) / totalRooms)} BYN
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rooms-section">
              <div className="rooms-header">
                <h2>Номерной фонд</h2>
                <div className="filters">
                  <div className="filter">
                    <label>Тип номера:</label>
                    <select 
                      value={filter.type} 
                      onChange={(e) => handleFilterChange("type", e.target.value)}
                    >
                      <option value="all">Все типы</option>
                      <option value="Standard">Стандарт</option>
                      <option value="Deluxe">Делюкс</option>
                      <option value="Suite">Люкс</option>
                    </select>
                  </div>
                  <div className="filter">
                    <label>Статус:</label>
                    <select 
                      value={filter.occupied} 
                      onChange={(e) => handleFilterChange("occupied", e.target.value)}
                    >
                      <option value="all">Все</option>
                      <option value="occupied">Занятые</option>
                      <option value="vacant">Свободные</option>
                    </select>
                  </div>
                  <div className="filter">
                    <label>Цена:</label>
                    <input 
                      type="range" 
                      min="0" 
                      max="10000" 
                      step="500"
                      value={filter.price[1]} 
                      onChange={(e) => handleFilterChange("price", [filter.price[0], parseInt(e.target.value)])} 
                    />
                    <span>{filter.price[0]} - {filter.price[1]} BYN</span>
                  </div>
                </div>
              </div>

              <div className="rooms-grid">
                {filteredRooms.map(room => (
                  <Room 
                    key={room.id}
                    room={room}
                    onClick={() => handleRoomClick(room)}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {activeSection === SECTIONS.USERS && hasPermission(ROLES.ADMIN) && (
          <UsersManagement />
        )}

        {activeSection === SECTIONS.CLIENTS && hasPermission(ROLES.EMPLOYEE) && (
          <ClientManagement 
            rooms={rooms} 
            addClientToRoom={addClientToRoom} 
          />
        )}

        {showModal && selectedRoom && (
          <Modal 
            room={selectedRoom}
            onClose={closeModal}
            isAdmin={hasPermission(ROLES.ADMIN)}
            isEmployee={hasPermission(ROLES.EMPLOYEE)}
            onUpdateRoom={updateRoom}
            onAddClient={addClientToRoom}
          />
        )}
      </div>
    </div>
  );
}

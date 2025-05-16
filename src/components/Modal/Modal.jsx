import { useState } from "react";
import Button from "../Button/Button";
import "./Modal.css";

export default function Modal({ 
  room, 
  onClose, 
  isAdmin = false, 
  isEmployee = false,
  onUpdateRoom,
  onAddClient
}) {
  const { id, number, type, occupied, lightsOn, features, price, clientId } = room;
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedRoom, setEditedRoom] = useState({
    type,
    basePrice: room.basePrice,
    features: { ...features }
  });
  
  const handleEditToggle = () => {
    setIsEditMode(!isEditMode);
  };
  
  const handleInputChange = (field, value) => {
    setEditedRoom(prev => ({ ...prev, [field]: value }));
  };
  
  const handleFeatureChange = (feature, value) => {
    setEditedRoom(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: value
      }
    }));
  };
  
  const handleSaveChanges = () => {
    onUpdateRoom(id, editedRoom);
    setIsEditMode(false);
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <header className="modal-header">
            <h2 className="modal-title">Номер {number}</h2>
            <button className="close-button" onClick={onClose}>×</button>
          </header>
          
          <div className="modal-content">
            {isEditMode ? (
              // Режим редактирования (только для админов)
              <div className="edit-mode">
                <div className="modal-section">
                  <h3>Редактирование номера</h3>
                  
                  <div className="form-group">
                    <label>Тип номера</label>
                    <select 
                      value={editedRoom.type}
                      onChange={(e) => handleInputChange("type", e.target.value)}
                      className="edit-select"
                    >
                      <option value="Standard">Стандарт</option>
                      <option value="Deluxe">Делюкс</option>
                      <option value="Suite">Люкс</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label>Базовая цена (₽)</label>
                    <input 
                      type="number"
                      value={editedRoom.basePrice}
                      onChange={(e) => handleInputChange("basePrice", Number(e.target.value))}
                      className="edit-input"
                      min="1000"
                      step="100"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Удобства</label>
                    <div className="features-edit-list">
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.airConditioner || false}
                            onChange={(e) => handleFeatureChange("airConditioner", e.target.checked)}
                          />
                          Кондиционер
                        </label>
                      </div>
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.curtains || false}
                            onChange={(e) => handleFeatureChange("curtains", e.target.checked)}
                          />
                          Шторы
                        </label>
                      </div>
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.miniBar || false}
                            onChange={(e) => handleFeatureChange("miniBar", e.target.checked)}
                          />
                          Мини-бар
                        </label>
                      </div>
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.shower || false}
                            onChange={(e) => handleFeatureChange("shower", e.target.checked)}
                          />
                          Душ
                        </label>
                      </div>
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.bathtub || false}
                            onChange={(e) => handleFeatureChange("bathtub", e.target.checked)}
                          />
                          Ванна
                        </label>
                      </div>
                      <div className="feature-edit-item">
                        <label>
                          <input 
                            type="checkbox"
                            checked={editedRoom.features.livingRoom || false}
                            onChange={(e) => handleFeatureChange("livingRoom", e.target.checked)}
                          />
                          Гостиная
                        </label>
                      </div>
                    </div>
                  </div>
                  
                  <div className="modal-actions">
                    <Button 
                      text="Отмена" 
                      variant="secondary"
                      clickHandler={handleEditToggle}
                    />
                    <Button 
                      text="Сохранить" 
                      variant="success"
                      clickHandler={handleSaveChanges}
                    />
                  </div>
                </div>
              </div>
            ) : (
              // Режим просмотра
              <>
                <div className="modal-section">
                  <h3>Основная информация</h3>
                  <div className="info-row">
                    <span className="info-label">Тип номера:</span>
                    <span className="info-value">{type}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Статус:</span>
                    <span className={`info-value status ${occupied ? 'occupied' : 'vacant'}`}>
                      {occupied ? 'Занят' : 'Свободен'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Освещение:</span>
                    <span className={`info-value status ${lightsOn ? 'lights-on' : 'lights-off'}`}>
                      {lightsOn ? 'Включено' : 'Выключено'}
                    </span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Текущая цена:</span>
                    <span className="info-value price">{price} BYN</span>
                  </div>
                  {occupied && clientId && (
                    <div className="info-row">
                      <span className="info-label">ID клиента:</span>
                      <span className="info-value client-id">{clientId}</span>
                    </div>
                  )}
                </div>
                
                <div className="modal-section">
                  <h3>Удобства</h3>
                  <div className="features-list">
                    {Object.entries(features).map(([feature, hasFeature]) => 
                      hasFeature && (
                        <div key={feature} className="feature-item">
                          <span className="feature-name">
                            {feature === 'airConditioner' && 'Кондиционер'}
                            {feature === 'curtains' && 'Шторы'}
                            {feature === 'miniBar' && 'Мини-бар'}
                            {feature === 'shower' && 'Душ'}
                            {feature === 'bathtub' && 'Ванна'}
                            {feature === 'livingRoom' && 'Гостиная'}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
                
                <div className="modal-section">
                  <h3>Действия</h3>
                  <div className="actions">
                    {isAdmin && (
                      <Button 
                        text="Редактировать" 
                        variant="primary"
                        clickHandler={handleEditToggle}
                        className="edit-button"
                      />
                    )}
                    
                    {isEmployee && !occupied && (
                      <Button 
                        text="Заселить клиента" 
                        variant="success"
                        clickHandler={() => onClose()}
                        className="book-button"
                      />
                    )}
                    
                    {occupied && (
                      <Button 
                        text="Освободить номер" 
                        variant="danger"
                        clickHandler={() => {
                          if (isAdmin || isEmployee) {
                            onUpdateRoom(id, { occupied: false, clientId: null });
                            onClose();
                          }
                        }}
                        className="clear-button"
                      />
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

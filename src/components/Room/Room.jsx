import "./Room.css";
import { useState } from "react";

export default function Room({ room, onClick }) {
  const { id, number, type, occupied, lightsOn, price } = room;
  const [showSensors, setShowSensors] = useState(false);
  
  const handleClick = (e) => {
    if (onClick) onClick(e);
  };
  
  const handleSensorsToggle = (e) => {
    e.stopPropagation();
    setShowSensors(!showSensors);
  };
  
  return (
    <div 
      className={`room ${occupied ? 'occupied' : 'vacant'} ${lightsOn ? 'lights-on' : ''}`}
      onClick={handleClick}
    >
      <div className="room-header">
        <span className="room-number">{number}</span>
        <span className={`room-status ${occupied ? 'occupied' : 'vacant'}`}>
          {occupied ? 'Занят' : 'Свободен'}
        </span>
      </div>
      
      <div className="room-info">
        <div className="room-type">{type}</div>
        <div className="room-price">{price} BYN</div>
      </div>
      
      <div className="room-lights">
        <span className="lights-indicator"></span>
        <span className="lights-text">{lightsOn ? 'Свет включен' : 'Свет выключен'}</span>
      </div>
      
      {/* <button 
        className="sensors-toggle-btn" 
        onClick={handleSensorsToggle}
      >
        {showSensors ? 'Hide Sensors' : 'Show Sensors'}
      </button> */}
      
      {/* {showSensors && <RoomSensors roomId={id} />} */}
    </div>
  );
}

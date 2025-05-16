import "./Room.css";

export default function Room({ room, onClick }) {
  const { number, type, occupied, lightsOn, price } = room;
  
  return (
    <div 
      className={`room ${occupied ? 'occupied' : 'vacant'} ${lightsOn ? 'lights-on' : ''}`}
      onClick={onClick}
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
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import './Analizing.css';

// Временной диапазон
const TIME_RANGES = {
  DAY_1: '1 день',
  DAYS_7: '7 дней',
  DAYS_30: '30 дней',
  MONTHS_3: '3 месяца',
  MONTHS_6: '6 месяцев'
};

export default function Analizing({ rooms }) {
  const [timeRange, setTimeRange] = useState(TIME_RANGES.DAY_1);
  const { isDarkMode } = useTheme();
  const [analyticsData, setAnalyticsData] = useState({
    occupiedRooms: 0,
    occupancyRate: 0,
    roomsWithLightsOn: 0,
    averagePrice: 0,
    roomTypes: {},
    historicalData: [],
    revenueData: []
  });
  
  // Используем useRef для хранения сгенерированных случайных значений
  // Они не будут меняться при перерисовке компонента
  const randomSeedRef = useRef({
    variationFactors: {},
    typeVariations: {},
    historicalVariations: {},
    revenueVariations: {}
  });

  // Инициализация случайных значений при первом рендере или изменении timeRange
  useEffect(() => {
    // Генерируем случайные вариации для каждого временного диапазона, если они еще не созданы
    Object.values(TIME_RANGES).forEach(range => {
      if (!randomSeedRef.current.variationFactors[range]) {
        switch (range) {
          case TIME_RANGES.DAY_1:
            randomSeedRef.current.variationFactors[range] = 0.9 + Math.random() * 0.2; // 90-110%
            break;
          case TIME_RANGES.DAYS_7:
            randomSeedRef.current.variationFactors[range] = 0.85 + Math.random() * 0.3; // 85-115%
            break;
          case TIME_RANGES.DAYS_30:
            randomSeedRef.current.variationFactors[range] = 0.8 + Math.random() * 0.4; // 80-120%
            break;
          case TIME_RANGES.MONTHS_3:
            randomSeedRef.current.variationFactors[range] = 0.75 + Math.random() * 0.5; // 75-125%
            break;
          case TIME_RANGES.MONTHS_6:
            randomSeedRef.current.variationFactors[range] = 0.7 + Math.random() * 0.6; // 70-130%
            break;
          default:
            randomSeedRef.current.variationFactors[range] = 1;
        }
      }
      
      // Генерируем вариации для типов комнат, если они не созданы
      if (!randomSeedRef.current.typeVariations[range]) {
        randomSeedRef.current.typeVariations[range] = {};
      }
      
      // Создаем вариации для исторических данных и доходов
      const dataPoints = getTimeRangeDataPoints(range);
      
      if (!randomSeedRef.current.historicalVariations[range]) {
        randomSeedRef.current.historicalVariations[range] = Array.from(
          { length: dataPoints }, 
          () => Math.random() * 0.4 - 0.2 // -20% до +20%
        );
      }
      
      if (!randomSeedRef.current.revenueVariations[range]) {
        randomSeedRef.current.revenueVariations[range] = Array.from(
          { length: dataPoints }, 
          () => Math.random() * 0.4 - 0.2 // -20% до +20%
        );
      }
    });
  }, []);

  // Расчет аналитических данных в зависимости от временного диапазона
  useEffect(() => {
    // Убедимся, что случайные значения были инициализированы
    if (!randomSeedRef.current.variationFactors[timeRange]) {
      return;
    }
    
    // Базовые данные
    const totalRooms = rooms.length;
    let occupiedRooms = rooms.filter(room => room.occupied).length;
    let roomsWithLightsOn = rooms.filter(room => room.lightsOn).length;
    
    // Уменьшаем цены в 10 раз
    let averagePrice = Math.round(rooms.reduce((sum, room) => sum + (room.price), 0) / totalRooms);
    
    // Применяем вариации в зависимости от выбранного диапазона
    const variationFactor = randomSeedRef.current.variationFactors[timeRange];
    occupiedRooms = Math.min(totalRooms, Math.round(occupiedRooms * variationFactor));
    roomsWithLightsOn = Math.min(totalRooms, Math.round(roomsWithLightsOn * variationFactor));
    averagePrice = Math.round(averagePrice * variationFactor);
    
    const occupancyRate = (occupiedRooms / totalRooms) * 100;
    
    // Данные по типам номеров с учетом временного диапазона
    const roomTypes = {};
    rooms.forEach(room => {
      if (!roomTypes[room.type]) {
        roomTypes[room.type] = { total: 0, occupied: 0 };
      }
      roomTypes[room.type].total += 1;
      
      // Создаем вариации для типов комнат, если они не созданы
      if (!randomSeedRef.current.typeVariations[timeRange][room.type]) {
        randomSeedRef.current.typeVariations[timeRange][room.type] = 0.8 + Math.random() * 0.4; // 80-120% от основной вариации
      }
    });
    
    // Применяем вариации загруженности для типов комнат
    Object.keys(roomTypes).forEach(type => {
      const typeVariation = variationFactor * randomSeedRef.current.typeVariations[timeRange][type];
      const totalRoomsOfType = roomTypes[type].total;
      roomTypes[type].occupied = Math.min(
        totalRoomsOfType, 
        Math.round(totalRoomsOfType * (occupancyRate / 100) * typeVariation)
      );
    });

    // Генерация исторических данных с вариациями
    const historicalData = getHistoricalData(occupancyRate, timeRange);
    const revenueData = getRevenueData(occupancyRate, averagePrice, totalRooms, timeRange);

    setAnalyticsData({
      occupiedRooms,
      occupancyRate,
      roomsWithLightsOn,
      averagePrice,
      roomTypes,
      historicalData,
      revenueData
    });
  }, [timeRange, rooms]);

  // Симуляция исторических данных на основе текущих данных и выбранного диапазона
  const getHistoricalData = (baseOccupancy, selectedTimeRange) => {
    const dataPoints = getTimeRangeDataPoints(selectedTimeRange);
    const variations = randomSeedRef.current.historicalVariations[selectedTimeRange];
    
    if (!variations) return [];
    
    // Генерация данных с постоянными вариациями
    return Array.from({ length: dataPoints }, (_, i) => {
      const sinVariation = Math.sin(i / (dataPoints / Math.PI)) * 15; // Синусоидная вариация для естественного тренда
      const randomVariation = variations[i] * baseOccupancy; // Случайная вариация на основе базового значения
      
      return {
        value: Math.min(100, Math.max(0, baseOccupancy + sinVariation + randomVariation)),
        label: i.toString()
      };
    });
  };

  // Симуляция прогноза доходов
  const getRevenueData = (occupancyRate, averagePrice, totalRooms, selectedTimeRange) => {
    const baseRevenue = averagePrice * totalRooms * occupancyRate / 100;
    const dataPoints = getTimeRangeDataPoints(selectedTimeRange);
    const variations = randomSeedRef.current.revenueVariations[selectedTimeRange];
    
    if (!variations) return [];
    
    return Array.from({ length: dataPoints }, (_, i) => {
      const sinVariation = Math.sin(i / (dataPoints / Math.PI)) * (baseRevenue * 0.2); // Синусоидная вариация
      const randomVariation = variations[i] * baseRevenue; // Постоянная случайная вариация
      
      return {
        value: Math.max(0, baseRevenue + sinVariation + randomVariation),
        label: i.toString()
      };
    });
  };

  // Получение количества точек данных для временного диапазона
  const getTimeRangeDataPoints = (selectedTimeRange) => {
    switch (selectedTimeRange) {
      case TIME_RANGES.DAY_1: return 24;
      case TIME_RANGES.DAYS_7: return 7;
      case TIME_RANGES.DAYS_30: return 30;
      case TIME_RANGES.MONTHS_3: return 12;
      case TIME_RANGES.MONTHS_6: return 24;
      default: return 24;
    }
  };

  // График загруженности (CSS-based)
  const renderOccupancyChart = () => {
    const maxValue = Math.max(...analyticsData.historicalData.map(d => d.value));
    
    return (
      <div className={`chart-container ${isDarkMode ? 'dark' : ''}`}>
        <h3 className="font-roboto">Загруженность отеля (%)</h3>
        <div className="chart">
          <div className="chart-bars">
            {analyticsData.historicalData.map((data, index) => (
              <div 
                key={index} 
                className="chart-bar" 
                style={{ height: `${(data.value / maxValue) * 100}%` }}
                title={`${data.value.toFixed(1)}%`}
              >
                <div className="chart-bar-tooltip">{data.value.toFixed(1)}%</div>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {analyticsData.historicalData.map((data, index) => (
              <div key={index} className="chart-label font-segoe">
                {data.label}
              </div>
            ))}
          </div>
        </div>
        <div className="chart-legend">
          <div className="chart-legend-label font-segoe">
            {timeRange === TIME_RANGES.DAY_1 ? 'Часы' : 
             (timeRange === TIME_RANGES.DAYS_7 || timeRange === TIME_RANGES.DAYS_30) ? 'Дни' : 
             'Недели'}
          </div>
        </div>
      </div>
    );
  };

  // График доходов (CSS-based)
  const renderRevenueChart = () => {
    const maxValue = Math.max(...analyticsData.revenueData.map(d => d.value));
    
    return (
      <div className={`chart-container ${isDarkMode ? 'dark' : ''}`}>
        <h3 className="font-roboto">Доход (BYN)</h3>
        <div className="chart">
          <div className="chart-bars">
            {analyticsData.revenueData.map((data, index) => (
              <div 
                key={index} 
                className="chart-bar revenue-bar" 
                style={{ height: `${(data.value / maxValue) * 100}%` }}
                title={`${Math.round(data.value)} BYN`}
              >
                <div className="chart-bar-tooltip">{Math.round(data.value)} BYN</div>
              </div>
            ))}
          </div>
          <div className="chart-labels">
            {analyticsData.revenueData.map((data, index) => (
              <div key={index} className="chart-label font-segoe">
                {data.label}
              </div>
            ))}
          </div>
        </div>
        <div className="chart-legend">
          <div className="chart-legend-label font-segoe">
            {timeRange === TIME_RANGES.DAY_1 ? 'Часы' : 
             (timeRange === TIME_RANGES.DAYS_7 || timeRange === TIME_RANGES.DAYS_30) ? 'Дни' : 
             'Недели'}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`analytics-page ${isDarkMode ? 'dark-mode' : ''}`}>
      <header className="content-header">
        <h1 className="font-roboto">Аналитика</h1>
      </header>

      <div className="time-range-selector">
        <span className="font-segoe">Временной диапазон:</span>
        {Object.values(TIME_RANGES).map(range => (
          <button
            key={range}
            className={`time-range-button ${timeRange === range ? 'active' : ''}`}
            onClick={() => setTimeRange(range)}
          >
            {range}
          </button>
        ))}
      </div>

      <div className="analytics-dashboard">
        <div className="analytics-cards">
          <div className="analytics-card">
            <h3 className="font-roboto">Загруженность</h3>
            <p className="analytics-value">{analyticsData.occupancyRate.toFixed(1)}%</p>
            <p className="font-segoe">{analyticsData.occupiedRooms} из {rooms.length} номеров</p>
          </div>
          <div className="analytics-card">
            <h3 className="font-roboto">Номера со светом</h3>
            <p className="analytics-value">{analyticsData.roomsWithLightsOn}</p>
            <p className="font-segoe">{((analyticsData.roomsWithLightsOn / rooms.length) * 100).toFixed(1)}% от всех номеров</p>
          </div>
          <div className="analytics-card">
            <h3 className="font-roboto">Средняя цена</h3>
            <p className="analytics-value">
              {analyticsData.averagePrice} BYN
            </p>
          </div>
        </div>

        <div className={`room-types-stats ${isDarkMode ? 'dark' : ''}`}>
          <h2 className="font-roboto">Статистика по типам номеров</h2>
          <div className="room-types-grid">
            {Object.entries(analyticsData.roomTypes).map(([type, data]) => (
              <div key={type} className="room-type-card">
                <h3 className="font-roboto">{type}</h3>
                <div className="room-type-stats">
                  <div className="room-type-stat">
                    <span className="font-segoe">Всего: </span>
                    <span className="font-segoe">{data.total}</span>
                  </div>
                  <div className="room-type-stat">
                    <span className="font-segoe">Занято: </span>
                    <span className="font-segoe">{data.occupied}</span>
                  </div>
                  <div className="room-type-stat">
                    <span className="font-segoe">Загруженность: </span>
                    <span className="font-segoe">{((data.occupied / data.total) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="charts-container">
          {renderOccupancyChart()}
          {renderRevenueChart()}
        </div>
      </div>
    </div>
  );
}
import React, { useEffect, useState } from 'react';
import './AnalyticsChart.css';

const AnalyticsChart = ({ data, timeRange, onTimeRangeChange }) => {
  const [currentData, setCurrentData] = useState(null);

  // Generate data based on time range
  const generateChartData = (range) => {
    const baseData = [
      { month: 'Jan', followers: 100, following: 600 },
      { month: 'Feb', followers: 150, following: 650 },
      { month: 'Mar', followers: 200, following: 700 },
      { month: 'Apr', followers: 280, following: 750 },
      { month: 'May', followers: 350, following: 800 },
      { month: 'Jun', followers: 450, following: 850 },
      { month: 'Jul', followers: 550, following: 900 },
      { month: 'Aug', followers: 650, following: 950 },
      { month: 'Sep', followers: 750, following: 1000 },
      { month: 'Oct', followers: 850, following: 1050 },
      { month: 'Nov', followers: 950, following: 1100 },
      { month: 'Dec', followers: 1050, following: 1150 }
    ];

    switch (range) {
      case '1month':
        return baseData.slice(-1); // Last month only
      case '6months':
        return baseData.slice(-6); // Last 6 months
      case '12months':
        return baseData; // All 12 months
      default:
        return baseData.slice(-6); // Default to 6 months
    }
  };

  // Update data when timeRange changes
  useEffect(() => {
    const newData = data || generateChartData(timeRange);
    setCurrentData(newData);
  }, [timeRange, data]);

  // Use current data or fallback to generated data
  const chartData = currentData || generateChartData(timeRange);

  const maxFollowers = Math.max(...chartData.map(d => d.followers));
  const maxFollowing = Math.max(...chartData.map(d => d.following));

  const getYPosition = (value, maxValue, height) => {
    return height - (value / maxValue) * height;
  };

  const chartHeight = 200;
  const chartWidth = 600;
  const padding = 40; // Add padding for better positioning
  const plotWidth = chartWidth - (padding * 2);
  const plotHeight = chartHeight - (padding * 2);

  // Calculate X position for data points
  const getXPosition = (index, totalPoints) => {
    if (totalPoints === 1) {
      return padding + (plotWidth / 2); // Center single point
    }
    return padding + (index / (totalPoints - 1)) * plotWidth;
  };

  // Generate path for followers line
  const followersPath = chartData.map((point, index) => {
    const x = getXPosition(index, chartData.length);
    const y = padding + getYPosition(point.followers, maxFollowers, plotHeight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate path for following line
  const followingPath = chartData.map((point, index) => {
    const x = getXPosition(index, chartData.length);
    const y = padding + getYPosition(point.following, maxFollowing, plotHeight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="analytics-chart">
      <div className="chart-header">
        <div className="chart-title">Growth Analytics</div>
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '1month' ? 'active' : ''}`}
            onClick={() => onTimeRangeChange('1month')}
          >
            Last Month
          </button>
          <button 
            className={`time-btn ${timeRange === '6months' ? 'active' : ''}`}
            onClick={() => onTimeRangeChange('6months')}
          >
            Last 6 Months
          </button>
          <button 
            className={`time-btn ${timeRange === '12months' ? 'active' : ''}`}
            onClick={() => onTimeRangeChange('12months')}
          >
            Last 12 Months
          </button>
        </div>
      </div>

      <div className="chart-container">
        <svg width={chartWidth} height={chartHeight} className="chart-svg">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <g key={index}>
              <line
                x1={padding}
                y1={padding + ratio * plotHeight}
                x2={padding + plotWidth}
                y2={padding + ratio * plotHeight}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={padding - 10}
                y={padding + ratio * plotHeight + 4}
                textAnchor="end"
                fontSize="12"
                fill="#9ca3af"
              >
                {Math.round(maxFollowers * (1 - ratio))}
              </text>
            </g>
          ))}

          {/* Y-axis labels for following */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => (
            <text
              key={`following-${index}`}
              x={padding + plotWidth + 10}
              y={padding + ratio * plotHeight + 4}
              textAnchor="start"
              fontSize="12"
              fill="#9ca3af"
            >
              {Math.round(maxFollowing * (1 - ratio))}
            </text>
          ))}

          {/* X-axis labels */}
          {chartData.map((point, index) => {
            const x = getXPosition(index, chartData.length);
            return (
              <text
                key={index}
                x={x}
                y={chartHeight - 10}
                textAnchor="middle"
                fontSize="12"
                fill="#9ca3af"
              >
                {point.month}
              </text>
            );
          })}

          {/* Followers line */}
          <path
            d={followersPath}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Following line */}
          <path
            d={followingPath}
            fill="none"
            stroke="#10b981"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points for followers */}
          {chartData.map((point, index) => {
            const x = getXPosition(index, chartData.length);
            const y = padding + getYPosition(point.followers, maxFollowers, plotHeight);
            return (
              <circle
                key={`followers-${index}`}
                cx={x}
                cy={y}
                r={4}
                fill="#3b82f6"
                stroke="white"
                strokeWidth={2}
              />
            );
          })}

          {/* Data points for following */}
          {chartData.map((point, index) => {
            const x = getXPosition(index, chartData.length);
            const y = padding + getYPosition(point.following, maxFollowing, plotHeight);
            return (
              <circle
                key={`following-${index}`}
                cx={x}
                cy={y}
                r={4}
                fill="#10b981"
                stroke="white"
                strokeWidth={2}
              />
            );
          })}
        </svg>
      </div>

      <div className="chart-legend">
        <div className="legend-item">
          <div className="legend-dot followers"></div>
          <span>Followers</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot following"></div>
          <span>Following</span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsChart;

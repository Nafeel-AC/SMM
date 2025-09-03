import React from 'react';
import './AnalyticsChart.css';

const AnalyticsChart = ({ data, timeRange, onTimeRangeChange }) => {
  // Sample data for the chart - in real app this would come from props
  const chartData = data || [
    { month: 'March', followers: 150, following: 700 },
    { month: 'April', followers: 300, following: 750 },
    { month: 'May', followers: 500, following: 800 },
    { month: 'June', followers: 750, following: 950 },
    { month: 'July', followers: 950, following: 1100 },
    { month: 'August', followers: 1200, following: 900 }
  ];

  const maxFollowers = Math.max(...chartData.map(d => d.followers));
  const maxFollowing = Math.max(...chartData.map(d => d.following));

  const getYPosition = (value, maxValue, height) => {
    return height - (value / maxValue) * height;
  };

  const chartHeight = 200;
  const chartWidth = 600;

  // Generate path for followers line
  const followersPath = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = getYPosition(point.followers, maxFollowers, chartHeight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  // Generate path for following line
  const followingPath = chartData.map((point, index) => {
    const x = (index / (chartData.length - 1)) * chartWidth;
    const y = getYPosition(point.following, maxFollowing, chartHeight);
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');

  return (
    <div className="analytics-chart">
      <div className="chart-header">
        <div className="chart-title">Growth Analytics</div>
        <div className="time-range-selector">
          <button 
            className={`time-btn ${timeRange === '7days' ? 'active' : ''}`}
            onClick={() => onTimeRangeChange('7days')}
          >
            Last 7 Days
          </button>
          <button 
            className={`time-btn ${timeRange === '4weeks' ? 'active' : ''}`}
            onClick={() => onTimeRangeChange('4weeks')}
          >
            Last 4 Weeks
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
                x1={0}
                y1={ratio * chartHeight}
                x2={chartWidth}
                y2={ratio * chartHeight}
                stroke="#f3f4f6"
                strokeWidth={1}
              />
              <text
                x={-10}
                y={ratio * chartHeight + 4}
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
              x={chartWidth + 10}
              y={ratio * chartHeight + 4}
              textAnchor="start"
              fontSize="12"
              fill="#9ca3af"
            >
              {Math.round(maxFollowing * (1 - ratio))}
            </text>
          ))}

          {/* X-axis labels */}
          {chartData.map((point, index) => (
            <text
              key={index}
              x={(index / (chartData.length - 1)) * chartWidth}
              y={chartHeight + 20}
              textAnchor="middle"
              fontSize="12"
              fill="#9ca3af"
            >
              {point.month}
            </text>
          ))}

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
            const x = (index / (chartData.length - 1)) * chartWidth;
            const y = getYPosition(point.followers, maxFollowers, chartHeight);
            return (
              <circle
                key={`followers-${index}`}
                cx={x}
                cy={y}
                r={4}
                fill="#3b82f6"
              />
            );
          })}

          {/* Data points for following */}
          {chartData.map((point, index) => {
            const x = (index / (chartData.length - 1)) * chartWidth;
            const y = getYPosition(point.following, maxFollowing, chartHeight);
            return (
              <circle
                key={`following-${index}`}
                cx={x}
                cy={y}
                r={4}
                fill="#10b981"
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

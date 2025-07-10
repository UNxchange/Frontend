import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, color }) => {
  const isPositive = change.startsWith('+');

  return (
    <div style={{
      backgroundColor: '#fff',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid #e9ecef',
      flex: 1,
      minWidth: '200px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
        <span style={{ width: '12px', height: '12px', backgroundColor: color, marginRight: '8px', borderRadius: '3px' }}></span>
        <h3 style={{ margin: 0, fontSize: '14px', color: '#6c757d', fontWeight: '500' }}>{title}</h3>
      </div>
      <p style={{ margin: '0 0 8px 0', fontSize: '28px', fontWeight: '600', color: '#343a40' }}>{value}</p>
      <p style={{ margin: 0, fontSize: '12px', color: isPositive ? '#28a745' : '#dc3545' }}>{change}</p>
    </div>
  );
};

export default StatCard;
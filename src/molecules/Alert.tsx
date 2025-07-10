import React from 'react';

interface AlertProps {
  message: string;
  details: string;
  type: 'warning' | 'danger';
}

const Alert: React.FC<AlertProps> = ({ message, details, type }) => {
  const baseStyle = {
    padding: '15px',
    borderRadius: '4px',
    marginBottom: '15px',
  };

  const typeStyles = {
    warning: {
      backgroundColor: '#fffbeb',
      color: '#947600',
      borderLeft: '4px solid #f59e0b',
    },
    danger: {
      backgroundColor: '#fef2f2',
      color: '#991b1b',
      borderLeft: '4px solid #ef4444',
    }
  };

  return (
    <div style={{ ...baseStyle, ...typeStyles[type] }}>
      <p style={{ margin: 0, fontWeight: 'bold' }}>{message}</p>
      {details && <p style={{ margin: '4px 0 0 0', fontSize: '14px' }}>{details}</p>}
    </div>
  );
};

export default Alert;
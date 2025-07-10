import React from 'react';

interface ActivityItemProps {
  text: string;
  time: string;
  color: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ text, time, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
    <span style={{ width: '10px', height: '10px', backgroundColor: color, marginRight: '15px', borderRadius: '50%' }}></span>
    <div>
      <p style={{ margin: 0, fontSize: '14px', color: '#343a40' }}>{text}</p>
      <p style={{ margin: 0, fontSize: '12px', color: '#6c757d' }}>{time}</p>
    </div>
  </div>
);

export default ActivityItem;
import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import '../styles/Notifications.css';

const Notifications = () => {
  const { notifications, dismissNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="notifications-container">
      {notifications.map((notification) => (
        <div 
          key={notification.id} 
          className={`notification notification-${notification.type}`}
        >
          <div className="notification-content">
            <span>{notification.message}</span>
          </div>
          <button 
            className="notification-close" 
            onClick={() => dismissNotification(notification.id)}
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications; 
import React, { createContext, useContext, useReducer, useCallback } from 'react';

// Define action types
const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
const DISMISS_NOTIFICATION = 'DISMISS_NOTIFICATION';

// Initial state
const initialState = {
  notifications: []
};

// Create context
const NotificationContext = createContext();

// Notification reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case DISMISS_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        )
      };
    default:
      return state;
  }
};

// Generate a unique ID for notifications
const generateId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 5);
};

// Notification Provider component
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  // Dismiss a notification
  const dismissNotification = useCallback((id) => {
    dispatch({
      type: DISMISS_NOTIFICATION,
      payload: id
    });
  }, []);

  // Add a notification
  const addNotification = useCallback((message, type = 'info', timeout = 5000) => {
    const id = generateId();
    
    dispatch({
      type: ADD_NOTIFICATION,
      payload: {
        id,
        message,
        type, // info, success, warning, error
      }
    });

    // Auto-dismiss after timeout
    if (timeout) {
      setTimeout(() => {
        dismissNotification(id);
      }, timeout);
    }

    return id;
  }, [dismissNotification]);

  // Convenience methods for different notification types
  const showSuccess = useCallback((message, timeout) => {
    return addNotification(message, 'success', timeout);
  }, [addNotification]);
  
  const notifySuccess = useCallback((message, timeout) => {
    return addNotification(message, 'success', timeout);
  }, [addNotification]);

  const showError = useCallback((message, timeout) => {
    return addNotification(message, 'error', timeout);
  }, [addNotification]);
  
  const notifyError = useCallback((message, timeout) => {
    return addNotification(message, 'error', timeout);
  }, [addNotification]);

  const showWarning = useCallback((message, timeout) => {
    return addNotification(message, 'warning', timeout);
  }, [addNotification]);
  
  const notifyWarning = useCallback((message, timeout) => {
    return addNotification(message, 'warning', timeout);
  }, [addNotification]);

  const showInfo = useCallback((message, timeout) => {
    return addNotification(message, 'info', timeout);
  }, [addNotification]);
  
  const notifyInfo = useCallback((message, timeout) => {
    return addNotification(message, 'info', timeout);
  }, [addNotification]);

  const value = {
    notifications: state.notifications,
    addNotification,
    dismissNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    notifySuccess,
    notifyError,
    notifyWarning,
    notifyInfo
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext; 
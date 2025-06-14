import React from 'react';
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function NotificationBanner() {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 left-4 right-4 z-50 space-y-2">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center justify-between animate-in slide-in-from-top-2 duration-300"
        >
          <div className="flex items-center space-x-3">
            {notification.includes('✅') && (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            {notification.includes('⚠️') && (
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
            )}
            {notification.includes('🚨') && (
              <AlertTriangle className="w-5 h-5 text-red-500" />
            )}
            {!notification.includes('✅') && !notification.includes('⚠️') && !notification.includes('🚨') && (
              <Info className="w-5 h-5 text-blue-500" />
            )}
            <span className="text-sm text-gray-900">{notification}</span>
          </div>
          <button
            onClick={() => removeNotification(index)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
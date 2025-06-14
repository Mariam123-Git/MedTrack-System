import React from 'react';
import { User, Bell, Wifi, WifiOff } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function Header() {
  const { user, isOffline, notifications } = useApp();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-medical-green to-medical-blue rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">M</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">MedTrack</h1>
            <p className="text-xs text-gray-500">Traçabilité Médicale</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Status de connexion */}
          <div className="flex items-center space-x-1">
            {isOffline ? (
              <WifiOff className="w-4 h-4 text-red-500" />
            ) : (
              <Wifi className="w-4 h-4 text-green-500" />
            )}
            <span className="text-xs text-gray-500">
              {isOffline ? 'Hors ligne' : 'En ligne'}
            </span>
          </div>

          {/* Notifications */}
          <div className="relative">
            <Bell className="w-5 h-5 text-gray-600" />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </div>

          {/* Profil utilisateur */}
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
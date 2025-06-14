import React from 'react';
import { Scan, BarChart3, AlertTriangle, MapPin, Home } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'scan', label: 'Scanner', icon: Scan },
    { id: 'stocks', label: 'Stocks', icon: BarChart3 },
    { id: 'alerts', label: 'Alertes', icon: AlertTriangle },
    { id: 'map', label: 'Centres', icon: MapPin },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-primary-50 text-primary-600' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
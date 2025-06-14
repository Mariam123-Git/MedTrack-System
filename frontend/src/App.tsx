import React, { useState } from 'react';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { NotificationBanner } from './components/Notifications/NotificationBanner';
import { Home } from './components/Dashboard/Home';
import { QRScanner } from './components/Scanner/QRScanner';
import { StockDashboard } from './components/Dashboard/StockDashboard';
import { AlertsPanel } from './components/Alerts/AlertsPanel';
import { HealthCentersMap } from './components/Map/HealthCentersMap';
import { TrackingHistory } from './components/Tracking/TrackingHistory';
import 'leaflet/dist/leaflet.css'; // CSS global nécessaire


function App() {
  const [activeTab, setActiveTab] = useState('home');

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <Home />;
      case 'scan':
        return <QRScanner />;
      case 'stocks':
        return <StockDashboard />;
      case 'alerts':
        return <AlertsPanel />;
      case 'map':
        return <HealthCentersMap />;
      case 'tracking':
        return <TrackingHistory />;
      default:
        return <Home />;
    }
  };

  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <NotificationBanner />
        
        <main className="flex-1 overflow-auto pb-20">
          {renderContent()}
        </main>
        
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
          <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </div>
    </AppProvider>
  );
}

export default App;
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, Medicine, Report } from '../types';

interface AppContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  notifications: string[];
  addNotification: (message: string) => void;
  removeNotification: (index: number) => void;
  scannedMedicine: Medicine | null;
  setScannedMedicine: (medicine: Medicine | null) => void;
  reports: Report[];
  addReport: (report: Report) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>({
    id: '1',
    name: 'Dr. Aminata Diallo',
    role: 'pharmacist',
    location: 'Dakar, Sénégal',
    verified: true
  });
  
  const [isOffline, setIsOffline] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [scannedMedicine, setScannedMedicine] = useState<Medicine | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const addNotification = (message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 5000);
  };

  const removeNotification = (index: number) => {
    setNotifications(prev => prev.filter((_, i) => i !== index));
  };

  const addReport = (report: Report) => {
    setReports(prev => [...prev, report]);
    addNotification('Signalement envoyé avec succès');
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      isOffline,
      setIsOffline,
      notifications,
      addNotification,
      removeNotification,
      scannedMedicine,
      setScannedMedicine,
      reports,
      addReport
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
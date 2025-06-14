import React, { useState } from 'react';
import { Scan, Camera, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { mockMedicines } from '../../data/mockData';
import { Medicine } from '../../types';

export function QRScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<Medicine | null>(null);
  const { addNotification, setScannedMedicine } = useApp();

  const simulateScan = () => {
    setIsScanning(true);
    
    // Simulation du scan avec délai
    setTimeout(() => {
      // Sélection aléatoire d'un médicament pour la démo
      const randomMedicine = mockMedicines[Math.floor(Math.random() * mockMedicines.length)];
      setScanResult(randomMedicine);
      setScannedMedicine(randomMedicine);
      setIsScanning(false);
      
      // Notification basée sur le statut
      if (randomMedicine.status === 'verified') {
        addNotification('✅ Médicament authentique vérifié');
      } else if (randomMedicine.status === 'suspicious') {
        addNotification('⚠️ Médicament suspect détecté');
      } else if (randomMedicine.status === 'expired') {
        addNotification('🚨 Médicament expiré');
      }
    }, 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'suspicious':
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case 'expired':
      case 'recalled':
        return <XCircle className="w-8 h-8 text-red-500" />;
      default:
        return <AlertTriangle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-green-50 border-green-200';
      case 'suspicious':
        return 'bg-yellow-50 border-yellow-200';
      case 'expired':
      case 'recalled':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Vérifié et authentique';
      case 'suspicious':
        return 'Suspect - Vérification requise';
      case 'expired':
        return 'Expiré';
      case 'recalled':
        return 'Rappelé';
      default:
        return 'Statut inconnu';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Scanner un médicament
        </h2>
        <p className="text-gray-600">
          Pointez la caméra vers le QR code du médicament
        </p>
      </div>

      {/* Zone de scan */}
      <div className="relative">
        <div className={`aspect-square bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center ${
          isScanning ? 'animate-pulse' : ''
        }`}>
          {isScanning ? (
            <div className="text-center">
              <div className="animate-scan">
                <Scan className="w-16 h-16 text-primary-500 mx-auto mb-4" />
              </div>
              <p className="text-primary-600 font-medium">Scanning en cours...</p>
              <div className="mt-4 flex justify-center">
                <div className="w-8 h-8 border-4 border-primary-200 border-t-primary-500 rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Appuyez pour commencer</p>
            </div>
          )}
        </div>

        {/* Coins de visée */}
        <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-primary-500 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-primary-500 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-primary-500 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-primary-500 rounded-br-lg"></div>
      </div>

      {/* Bouton de scan */}
      <button
        onClick={simulateScan}
        disabled={isScanning}
        className="w-full bg-primary-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        {isScanning ? 'Scanning...' : 'Commencer le scan'}
      </button>

      {/* Résultat du scan */}
      {scanResult && (
        <div className={`p-6 rounded-xl border-2 ${getStatusColor(scanResult.status)} animate-in slide-in-from-bottom-4 duration-500`}>
          <div className="flex items-start space-x-4">
            {getStatusIcon(scanResult.status)}
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {scanResult.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {getStatusText(scanResult.status)}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">NFT ID:</span>
                  <span className="font-mono">{scanResult.nftId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Fabricant:</span>
                  <span>{scanResult.manufacturer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Lot:</span>
                  <span className="font-mono">{scanResult.batchNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Expiration:</span>
                  <span>{new Date(scanResult.expirationDate).toLocaleDateString('fr-FR')}</span>
                </div>
              </div>

              <button 
                onClick={() => setScannedMedicine(scanResult)}
                className="mt-4 w-full bg-white text-primary-600 border border-primary-600 py-2 px-4 rounded-lg hover:bg-primary-50 transition-colors duration-200"
              >
                Voir l'historique complet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
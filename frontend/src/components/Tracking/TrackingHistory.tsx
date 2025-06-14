import React from 'react';
import { MapPin, Clock, User, Thermometer, Droplets, CheckCircle, ArrowRight } from 'lucide-react';
import { mockTrackingHistory } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

export function TrackingHistory() {
  const { scannedMedicine } = useApp();

  if (!scannedMedicine) {
    return (
      <div className="p-4 text-center">
        <div className="bg-gray-50 rounded-2xl p-8">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Aucun médicament sélectionné
          </h3>
          <p className="text-gray-600">
            Scannez un médicament pour voir son historique de traçabilité
          </p>
        </div>
      </div>
    );
  }

  const history = mockTrackingHistory.filter(h => h.medicineId === scannedMedicine.id);

  return (
    <div className="p-4 space-y-6">
      {/* En-tête du médicament */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {scannedMedicine.name}
        </h2>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-gray-500">NFT ID:</span>
            <p className="font-mono text-gray-900">{scannedMedicine.nftId}</p>
          </div>
          <div>
            <span className="text-gray-500">Lot:</span>
            <p className="font-mono text-gray-900">{scannedMedicine.batchNumber}</p>
          </div>
          <div>
            <span className="text-gray-500">Fabricant:</span>
            <p className="text-gray-900">{scannedMedicine.manufacturer}</p>
          </div>
          <div>
            <span className="text-gray-500">Expiration:</span>
            <p className="text-gray-900">
              {new Date(scannedMedicine.expirationDate).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
      </div>

      {/* Historique de traçabilité */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Historique de traçabilité
        </h3>
        
        <div className="space-y-4">
          {history.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Ligne de connexion */}
              {index < history.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200" />
              )}
              
              <div className="flex items-start space-x-4">
                {/* Icône de statut */}
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-6 h-6 text-primary-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {entry.action}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(entry.timestamp).toLocaleString('fr-FR')}
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{entry.location}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{entry.actor}</span>
                    </div>
                    
                    {(entry.temperature || entry.humidity) && (
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {entry.temperature && (
                          <div className="flex items-center space-x-1">
                            <Thermometer className="w-4 h-4" />
                            <span>{entry.temperature}°C</span>
                          </div>
                        )}
                        {entry.humidity && (
                          <div className="flex items-center space-x-1">
                            <Droplets className="w-4 h-4" />
                            <span>{entry.humidity}%</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vérification blockchain */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Vérification Blockchain
        </h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">NFT validé sur Hedera</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Historique infalsifiable</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-sm text-gray-700">Chaîne de custody vérifiée</span>
          </div>
        </div>
        
        <div className="mt-3 p-3 bg-white rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Hash de transaction:</span>
            <span className="font-mono text-gray-900">0x1a2b3c...def456</span>
          </div>
        </div>
      </div>
    </div>
  );
}
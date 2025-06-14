import React from 'react';
import { TrendingUp, TrendingDown, AlertCircle, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { mockStockPredictions } from '../../data/mockData';

export function StockDashboard() {
  const data = mockStockPredictions.map(item => ({
    name: item.medicineName.split(' ')[0],
    stock: item.currentStock,
    besoin: item.predictedNeed,
    jours: item.daysUntilStockout
  }));

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high': return '#EF4444';
      case 'medium': return '#F97316';
      case 'low': return '#22C55E';
      default: return '#6B7280';
    }
  };

  const totalMedicines = mockStockPredictions.length;
  const highRiskCount = mockStockPredictions.filter(item => item.riskLevel === 'high').length;
  const lowStockCount = mockStockPredictions.filter(item => item.daysUntilStockout <= 7).length;

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Gestion Intelligente des Stocks
        </h2>
        <p className="text-gray-600">
          Prédictions IA et optimisation automatique
        </p>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Médicaments</p>
              <p className="text-2xl font-bold text-gray-900">{totalMedicines}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Risque élevé</p>
              <p className="text-2xl font-bold text-red-500">{highRiskCount}</p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Graphique des stocks */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Stock vs Besoin Prévu
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="stock" fill="#3B82F6" name="Stock actuel" />
              <Bar dataKey="besoin" fill="#EF4444" name="Besoin prévu" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Liste des prédictions */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Prédictions & Recommandations
        </h3>
        
        {mockStockPredictions.map((prediction, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">
                  {prediction.medicineName}
                </h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prediction.riskLevel === 'high' 
                      ? 'bg-red-100 text-red-800'
                      : prediction.riskLevel === 'medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {prediction.riskLevel === 'high' ? 'Risque élevé' :
                     prediction.riskLevel === 'medium' ? 'Risque moyen' : 'Risque faible'}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="flex items-center space-x-1">
                  {prediction.daysUntilStockout <= 7 ? (
                    <TrendingDown className="w-4 h-4 text-red-500" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-green-500" />
                  )}
                  <span className="text-sm font-medium">
                    {prediction.daysUntilStockout} jours
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-3">
              <div>
                <p className="text-xs text-gray-500">Stock actuel</p>
                <p className="text-lg font-semibold">{prediction.currentStock}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Besoin prévu</p>
                <p className="text-lg font-semibold">{prediction.predictedNeed}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Recommandation IA:</span> {prediction.recommendedAction}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
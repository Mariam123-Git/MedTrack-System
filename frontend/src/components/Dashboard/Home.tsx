import React from 'react';
import { Shield, Users, TrendingUp, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

export function Home() {
  const { user } = useApp();

  const stats = [
    {
      label: 'Médicaments vérifiés',
      value: '1,247',
      icon: CheckCircle,
      color: 'text-green-500',
      bg: 'bg-green-50'
    },
    {
      label: 'Signalements traités',
      value: '34',
      icon: Shield,
      color: 'text-blue-500',
      bg: 'bg-blue-50'
    },
    {
      label: 'Centres connectés',
      value: '156',
      icon: Users,
      color: 'text-purple-500',
      bg: 'bg-purple-50'
    },
    {
      label: 'Alertes actives',
      value: '7',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bg: 'bg-orange-50'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: 'Médicament vérifié',
      details: 'Paracétamol 500mg - NFT validé',
      time: 'Il y a 5 min',
      status: 'success'
    },
    {
      id: 2,
      action: 'Alerte stock',
      details: 'Stock faible détecté - Amoxicilline',
      time: 'Il y a 15 min',
      status: 'warning'
    },
    {
      id: 3,
      action: 'Signalement reçu',
      details: 'Médicament suspect à Saint-Louis',
      time: 'Il y a 1h',
      status: 'danger'
    },
    {
      id: 4,
      action: 'Redistribution',
      details: '200 unités transférées vers Thiès',
      time: 'Il y a 2h',
      status: 'info'
    }
  ];

  return (
    <div className="p-4 space-y-6">
      {/* En-tête de bienvenue */}
      <div className="bg-gradient-to-r from-primary-500 to-blue-600 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Bonjour, {user?.name?.split(' ')[1] || 'Docteur'}! 👋
        </h1>
        <p className="text-primary-100 mb-4">
          Voici un aperçu de votre activité aujourd'hui
        </p>
        <div className="flex items-center space-x-2 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Système opérationnel - Blockchain synchronisée</span>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions rapides */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center space-x-3 p-3 bg-primary-50 text-primary-700 rounded-lg hover:bg-primary-100 transition-colors">
            <Shield className="w-5 h-5" />
            <span className="font-medium">Scanner</span>
          </button>
          <button className="flex items-center space-x-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
            <TrendingUp className="w-5 h-5" />
            <span className="font-medium">Stocks</span>
          </button>
          <button className="flex items-center space-x-3 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">Signaler</span>
          </button>
          <button className="flex items-center space-x-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
            <Users className="w-5 h-5" />
            <span className="font-medium">Centres</span>
          </button>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Activité récente</h3>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className={`w-2 h-2 rounded-full mt-2 ${
                activity.status === 'success' ? 'bg-green-500' :
                activity.status === 'warning' ? 'bg-yellow-500' :
                activity.status === 'danger' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.details}</p>
              </div>
              <div className="flex items-center space-x-1 text-xs text-gray-400">
                <Clock className="w-3 h-3" />
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Impact */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Impact de la semaine</h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Contrefaçons détectées</span>
            <span className="font-semibold text-red-600">12</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Vies potentiellement sauvées</span>
            <span className="font-semibold text-green-600">47</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Réduction du gaspillage</span>
            <span className="font-semibold text-blue-600">23%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
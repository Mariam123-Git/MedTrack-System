import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, MapPin, User, Plus } from 'lucide-react';
import { mockReports } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { Report } from '../../types';

export function AlertsPanel() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [newReport, setNewReport] = useState({
    type: 'counterfeit' as Report['type'],
    location: '',
    description: '',
    severity: 'medium' as Report['severity']
  });
  const { addReport, user } = useApp();

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      reportedBy: user?.name || 'Utilisateur anonyme',
      timestamp: new Date().toISOString(),
      status: 'pending'
    };

    addReport(report);
    setNewReport({
      type: 'counterfeit',
      location: '',
      description: '',
      severity: 'medium'
    });
    setShowReportForm(false);
  };

  const getTypeLabel = (type: Report['type']) => {
    switch (type) {
      case 'counterfeit': return 'Contrefaçon';
      case 'shortage': return 'Pénurie';
      case 'quality_issue': return 'Problème qualité';
      case 'side_effect': return 'Effet secondaire';
      default: return 'Autre';
    }
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'investigating':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getSeverityColor = (severity: Report['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Alertes & Signalements</h2>
          <p className="text-gray-600">Signalements communautaires et alertes système</p>
        </div>
        <button 
          onClick={() => setShowReportForm(true)}
          className="bg-primary-500 text-white p-3 rounded-xl hover:bg-primary-600 transition-colors shadow-lg"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600">
            {mockReports.filter(r => r.status === 'pending').length}
          </div>
          <div className="text-sm text-gray-500">En attente</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {mockReports.filter(r => r.status === 'investigating').length}
          </div>
          <div className="text-sm text-gray-500">Investigation</div>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {mockReports.filter(r => r.status === 'resolved').length}
          </div>
          <div className="text-sm text-gray-500">Résolus</div>
        </div>
      </div>

      {/* Formulaire de signalement */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Nouveau signalement</h3>
            
            <form onSubmit={handleSubmitReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type de problème
                </label>
                <select 
                  value={newReport.type}
                  onChange={(e) => setNewReport({...newReport, type: e.target.value as Report['type']})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="counterfeit">Contrefaçon</option>
                  <option value="shortage">Pénurie</option>
                  <option value="quality_issue">Problème de qualité</option>
                  <option value="side_effect">Effet secondaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Localisation
                </label>
                <input 
                  type="text"
                  value={newReport.location}
                  onChange={(e) => setNewReport({...newReport, location: e.target.value})}
                  placeholder="Ville, pharmacie, centre de santé..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gravité
                </label>
                <select 
                  value={newReport.severity}
                  onChange={(e) => setNewReport({...newReport, severity: e.target.value as Report['severity']})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="low">Faible</option>
                  <option value="medium">Moyenne</option>
                  <option value="high">Élevée</option>
                  <option value="critical">Critique</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea 
                  value={newReport.description}
                  onChange={(e) => setNewReport({...newReport, description: e.target.value})}
                  rows={3}
                  placeholder="Décrivez en détail le problème rencontré..."
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowReportForm(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-primary-500 text-white py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Signaler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des signalements */}
      <div className="space-y-4">
        {mockReports.map((report) => (
          <div key={report.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(report.status)}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {getTypeLabel(report.type)}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(report.severity)}`}>
                      {report.severity === 'critical' ? 'Critique' :
                       report.severity === 'high' ? 'Élevé' :
                       report.severity === 'medium' ? 'Moyen' : 'Faible'}
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-xs text-gray-500">
                {new Date(report.timestamp).toLocaleDateString('fr-FR')}
              </span>
            </div>

            <p className="text-gray-700 mb-3">{report.description}</p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{report.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <User className="w-4 h-4" />
                  <span>{report.reportedBy}</span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                report.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {report.status === 'resolved' ? 'Résolu' :
                 report.status === 'investigating' ? 'Investigation' : 'En attente'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
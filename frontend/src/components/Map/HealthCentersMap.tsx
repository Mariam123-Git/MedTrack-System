import React, { useState } from 'react';
import { MapPin, Phone, Navigation, Italic as Hospital, Stethoscope, Building, Home } from 'lucide-react';
import { mockHealthCenters } from '../../data/mockData';
import { HealthCenter } from '../../types';


import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';


export function HealthCentersMap() {
  const [selectedCenter, setSelectedCenter] = useState<HealthCenter | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getTypeIcon = (type: HealthCenter['type']) => {
    switch (type) {
      case 'hospital':
        return <Hospital className="w-5 h-5 text-red-500" />;
      case 'clinic':
        return <Stethoscope className="w-5 h-5 text-blue-500" />;
      case 'pharmacy':
        return <Building className="w-5 h-5 text-green-500" />;
      case 'health_post':
        return <Home className="w-5 h-5 text-purple-500" />;
      default:
        return <MapPin className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeLabel = (type: HealthCenter['type']) => {
    switch (type) {
      case 'hospital': return 'Hôpital';
      case 'clinic': return 'Clinique';
      case 'pharmacy': return 'Pharmacie';
      case 'health_post': return 'Poste de santé';
      default: return 'Centre de santé';
    }
  };

  const getTypeColor = (type: HealthCenter['type']) => {
    switch (type) {
      case 'hospital': return 'bg-red-50 border-red-200';
      case 'clinic': return 'bg-blue-50 border-blue-200';
      case 'pharmacy': return 'bg-green-50 border-green-200';
      case 'health_post': return 'bg-purple-50 border-purple-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredCenters = filter === 'all' 
    ? mockHealthCenters 
    : mockHealthCenters.filter(center => center.type === filter);

  return (
    <div className="p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Centres de Santé
        </h2>
        <p className="text-gray-600">
          Réseau de pharmacies et centres de santé connectés
        </p>
      </div>

      {/* Filtres */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'all', label: 'Tous', count: mockHealthCenters.length },
          { id: 'hospital', label: 'Hôpitaux', count: mockHealthCenters.filter(c => c.type === 'hospital').length },
          { id: 'pharmacy', label: 'Pharmacies', count: mockHealthCenters.filter(c => c.type === 'pharmacy').length },
          { id: 'clinic', label: 'Cliniques', count: mockHealthCenters.filter(c => c.type === 'clinic').length },
          { id: 'health_post', label: 'Postes', count: mockHealthCenters.filter(c => c.type === 'health_post').length }
        ].map((filterOption) => (
          <button
            key={filterOption.id}
            onClick={() => setFilter(filterOption.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === filterOption.id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{filterOption.label}</span>
            <span className={`px-2 py-1 rounded-full text-xs ${
              filter === filterOption.id
                ? 'bg-white bg-opacity-20 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}>
              {filterOption.count}
            </span>
          </button>
        ))}
      </div>

      {/* Carte simulée */}
      <div className="h-96 rounded-2xl overflow-hidden border-2 border-gray-300">
  <MapContainer
    center={[14.6928, -17.4467]} // par exemple : Dakar
    zoom={12}
    scrollWheelZoom={true}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer
      attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {filteredCenters.map((center) => (
      <Marker
        key={center.id}
        position={[center.coordinates.lat, center.coordinates.lng]}
        icon={L.icon({
          iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        })}
      >
        <Popup>
          <strong>{center.name}</strong><br />
          {getTypeLabel(center.type)}<br />
          {center.location}
        </Popup>
      </Marker>
    ))}
  </MapContainer>
</div>


      {/* Liste des centres */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900">
          Centres disponibles ({filteredCenters.length})
        </h3>
        
        {filteredCenters.map((center) => (
          <div 
            key={center.id} 
            className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
              selectedCenter?.id === center.id 
                ? getTypeColor(center.type) + ' shadow-md'
                : 'bg-white border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setSelectedCenter(selectedCenter?.id === center.id ? null : center)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                {getTypeIcon(center.type)}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">
                    {center.name}
                  </h4>
                  <p className="text-sm text-gray-600 mb-1">
                    {getTypeLabel(center.type)}
                  </p>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span>{center.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${
                  center.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                }`} />
                <span className="text-xs text-gray-500">
                  {center.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
              </div>
            </div>

            {selectedCenter?.id === center.id && (
              <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{center.contact}</span>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4" />
                  <span>
                    {center.coordinates.lat.toFixed(4)}, {center.coordinates.lng.toFixed(4)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <button className="flex-1 bg-primary-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-primary-600 transition-colors">
                    Voir les stocks
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                    Itinéraire
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Statistiques du réseau */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Réseau MedTrack</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-600">
              {mockHealthCenters.filter(c => c.status === 'active').length}
            </div>
            <div className="text-sm text-gray-500">Centres actifs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-sm text-gray-500">Disponibilité</div>
          </div>
        </div>
      </div>
    </div>
  );
}
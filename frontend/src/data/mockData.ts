import { Medicine, TrackingHistory, StockPrediction, HealthCenter, Report } from '../types';

export const mockMedicines: Medicine[] = [
  {
    id: '1',
    name: 'Paracétamol 500mg',
    nftId: 'HED-PAR-001-2024',
    manufacturer: 'PharmaAfrique SA',
    batchNumber: 'PA-2024-001',
    expirationDate: '2025-12-31',
    productionDate: '2024-01-15',
    status: 'verified',
    location: 'Pharmacie Centrale Dakar',
    qrCode: 'QR-PAR-001',
    dosage: '500mg',
    activeIngredient: 'Paracétamol'
  },
  {
    id: '2',
    name: 'Amoxicilline 250mg',
    nftId: 'HED-AMO-002-2024',
    manufacturer: 'Laboratoires Africains',
    batchNumber: 'LA-2024-002',
    expirationDate: '2024-08-30',
    productionDate: '2023-08-30',
    status: 'expired',
    location: 'Centre de Santé Thiès',
    qrCode: 'QR-AMO-002',
    dosage: '250mg',
    activeIngredient: 'Amoxicilline'
  },
  {
    id: '3',
    name: 'Artemether-Lumefantrine',
    nftId: 'HED-ART-003-2024',
    manufacturer: 'MedCorp International',
    batchNumber: 'MC-2024-003',
    expirationDate: '2025-06-15',
    productionDate: '2024-02-01',
    status: 'suspicious',
    location: 'Pharmacie St-Louis',
    qrCode: 'QR-ART-003',
    dosage: '20mg/120mg',
    activeIngredient: 'Artemether + Lumefantrine'
  }
];

export const mockTrackingHistory: TrackingHistory[] = [
  {
    id: '1',
    medicineId: '1',
    timestamp: '2024-01-15T10:00:00Z',
    location: 'Usine PharmaAfrique - Abidjan',
    action: 'Production',
    actor: 'Système automatisé',
    temperature: 22,
    humidity: 45
  },
  {
    id: '2',
    medicineId: '1',
    timestamp: '2024-01-16T14:30:00Z',
    location: 'Entrepôt Central - Dakar',
    action: 'Réception',
    actor: 'Agent logistique Koné',
    temperature: 18,
    humidity: 40
  },
  {
    id: '3',
    medicineId: '1',
    timestamp: '2024-01-18T09:15:00Z',
    location: 'Pharmacie Centrale Dakar',
    action: 'Distribution',
    actor: 'Pharmacien Diallo',
    temperature: 20,
    humidity: 38
  }
];

export const mockStockPredictions: StockPrediction[] = [
  {
    medicineId: '1',
    medicineName: 'Paracétamol 500mg',
    currentStock: 50,
    predictedNeed: 180,
    riskLevel: 'high',
    daysUntilStockout: 7,
    recommendedAction: 'Commande urgente de 200 unités'
  },
  {
    medicineId: '2',
    medicineName: 'Amoxicilline 250mg',
    currentStock: 120,
    predictedNeed: 90,
    riskLevel: 'low',
    daysUntilStockout: 25,
    recommendedAction: 'Stock suffisant'
  },
  {
    medicineId: '3',
    medicineName: 'Artemether-Lumefantrine',
    currentStock: 30,
    predictedNeed: 150,
    riskLevel: 'high',
    daysUntilStockout: 3,
    recommendedAction: 'Redistribution depuis Thiès + Commande urgente'
  }
];

export const mockHealthCenters: HealthCenter[] = [
  {
    id: '1',
    name: 'Hôpital Principal de Dakar',
    location: 'Dakar, Sénégal',
    coordinates: { lat: 14.6937, lng: -17.4441 },
    type: 'hospital',
    contact: '+221 33 821 2345',
    status: 'active'
  },
  {
    id: '2',
    name: 'Pharmacie Centrale',
    location: 'Thiès, Sénégal',
    coordinates: { lat: 14.7886, lng: -16.9256 },
    type: 'pharmacy',
    contact: '+221 33 951 1234',
    status: 'active'
  },
  {
    id: '3',
    name: 'Centre de Santé Communautaire',
    location: 'Saint-Louis, Sénégal',
    coordinates: { lat: 16.0379, lng: -16.5124 },
    type: 'clinic',
    contact: '+221 33 961 5678',
    status: 'active'
  }
];

export const mockReports: Report[] = [
  {
    id: '1',
    type: 'counterfeit',
    medicineId: '3',
    location: 'Pharmacie St-Louis',
    description: 'Emballage suspect, code QR non reconnu',
    reportedBy: 'Patient Amadou Ba',
    timestamp: '2024-01-20T16:30:00Z',
    status: 'investigating',
    severity: 'high'
  },
  {
    id: '2',
    type: 'shortage',
    location: 'Centre de Santé Fatick',
    description: 'Rupture de stock de vaccins BCG depuis 5 jours',
    reportedBy: 'Infirmière Fatou Sow',
    timestamp: '2024-01-19T08:00:00Z',
    status: 'pending',
    severity: 'critical'
  }
];
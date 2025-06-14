export interface Medicine {
  id: string;
  name: string;
  nftId: string;
  manufacturer: string;
  batchNumber: string;
  expirationDate: string;
  productionDate: string;
  status: 'verified' | 'suspicious' | 'recalled' | 'expired';
  location: string;
  qrCode: string;
  dosage: string;
  activeIngredient: string;
}

export interface TrackingHistory {
  id: string;
  medicineId: string;
  timestamp: string;
  location: string;
  action: string;
  actor: string;
  temperature?: number;
  humidity?: number;
}

export interface StockPrediction {
  medicineId: string;
  medicineName: string;
  currentStock: number;
  predictedNeed: number;
  riskLevel: 'low' | 'medium' | 'high';
  daysUntilStockout: number;
  recommendedAction: string;
}

export interface HealthCenter {
  id: string;
  name: string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  type: 'hospital' | 'clinic' | 'pharmacy' | 'health_post';
  contact: string;
  status: 'active' | 'inactive';
}

export interface Report {
  id: string;
  type: 'counterfeit' | 'shortage' | 'quality_issue' | 'side_effect';
  medicineId?: string;
  location: string;
  description: string;
  reportedBy: string;
  timestamp: string;
  status: 'pending' | 'investigating' | 'resolved';
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface User {
  id: string;
  name: string;
  role: 'patient' | 'pharmacist' | 'doctor' | 'health_worker' | 'regulator';
  location: string;
  verified: boolean;
}
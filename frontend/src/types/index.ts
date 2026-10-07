export interface RiskZone {
  zone_code: string;
  name: string;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  risk_score: number;
  center_lat: number;
  center_lng: number;
  population: number;
  vulnerable_population: number;
}

export interface Household {
  household_code: string;
  zone_id: string;
  latitude: number;
  longitude: number;
  members_count: number;
  vulnerability_score: number;
}

export interface PriorityItem {
  sos_id: number;
  sos_code: string;
  household_code: string;
  priority_score: number;
  severity: string;
  latitude: number;
  longitude: number;
  status: string;
  rank: number;
}

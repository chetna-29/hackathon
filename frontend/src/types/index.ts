export interface RiskZone {
  zone_code: string;
  name: string;
  risk_level: "LOW" | "MEDIUM" | "HIGH";
  risk_score: number;
  center_lat: number;
  center_lng: number;
  population: number;
  vulnerable_population: number;
  current_rainfall_mm: number;
  slope_gradient: number;
  elevation_m: number;
  soil_saturation: number;
}

export interface Household {
  id: number;
  household_code: string;
  zone_id: string;
  latitude: number;
  longitude: number;
  members_count: number;
  elderly_count: number;
  children_count: number;
  disabled_count: number;
  medical_needs: string | null;
  vulnerability_score: number;
}

export interface SOSRequest {
  id: number;
  sos_code: string;
  household_code: string | null;
  severity: string;
  status: string;
  latitude: number;
  longitude: number;
  emergency_type: string;
  created_at: string;
  via_mesh: boolean;
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
  elderly_count: number;
  disabled_count: number;
  source_type?: string;
  via_mesh?: string;
  hops_count?: number;
  notes?: string;
}

export interface Shelter {
  id: number;
  shelter_code: string;
  name: string;
  latitude: number;
  longitude: number;
  capacity: number;
  current_occupancy: number;
  available_beds: number;
  is_safe: boolean;
  has_medical_staff: boolean;
  has_oxygen?: boolean;
  has_power_backup?: boolean;
}

export interface RouteResponse {
  distance_km: number;
  duration_minutes: number;
  hazard_status: string;
  bypassed_hazard_zones: string[];
  path: number[][];
  destination_name: string;
}

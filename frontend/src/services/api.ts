import axios from "axios";
import type { RiskZone, Household, PriorityItem } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const disasterApi = {
  getZones: async () => {
    const res = await api.get<RiskZone[]>("/disaster/zones");
    return res.data;
  },
  predictLandslide: async (rainfall: number, slope: number) => {
    const res = await api.post("/disaster/predict/landslide", {
      rainfall_24h: rainfall,
      slope: slope,
    });
    return res.data;
  },
};

export const householdApi = {
  getHouseholds: async () => {
    const res = await api.get<Household[]>("/households/");
    return res.data;
  },
};

export const sosApi = {
  getActiveSOS: async () => {
    const res = await api.get("/sos/active");
    return res.data;
  },
  updateStatus: async (sosId: number, status: string) => {
    const res = await api.patch(`/sos/${sosId}/status`, { status });
    return res.data;
  },
  createSOS: async (payload: any) => {
    const res = await api.post("/sos/", payload);
    return res.data;
  },
};

export const meshApi = {
  triggerSimulatedSOS: async (payload: any) => {
    const res = await api.post("/mesh/packet", payload);
    return res.data;
  },
};

export const priorityApi = {
  getQueue: async () => {
    const res = await api.get<{
      total_active_sos: number;
      queue: PriorityItem[];
    }>("/priority/queue");
    return res.data;
  },
};

export const routingApi = {
  getSafeRoute: async (
    origin: { lat: number; lng: number },
    dest?: { lat: number; lng: number },
    targetShelterCode?: string,
  ) => {
    const res = await api.post("/routing/safe-route", {
      origin,
      destination: dest,
      target_shelter_code: targetShelterCode,
      avoid_high_risk: true,
    });
    return res.data;
  },
};

export const shelterApi = {
  getShelters: async () => {
    const res = await api.get("/shelters/");
    return res.data;
  },
};

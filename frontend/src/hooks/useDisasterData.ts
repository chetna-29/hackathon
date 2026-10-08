import { useState, useEffect } from "react";
import {
  disasterApi,
  householdApi,
  priorityApi,
  shelterApi,
  sosApi,
} from "../services/api";
import { wsService } from "../services/websocket";
import type {
  RiskZone,
  Household,
  PriorityItem,
  Shelter,
  SOSRequest,
} from "../types";

export const useDisasterData = () => {
  const [zones, setZones] = useState<RiskZone[]>([]);
  const [households, setHouseholds] = useState<Household[]>([]);
  const [queue, setQueue] = useState<PriorityItem[]>([]);
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [activeSos, setActiveSos] = useState<SOSRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [_zones, _households, _queueData, _shelters, _sos] =
        await Promise.all([
          disasterApi.getZones(),
          householdApi.getHouseholds(),
          priorityApi.getQueue(),
          shelterApi.getShelters(),
          sosApi.getActiveSOS(),
        ]);
      setZones(_zones);
      setHouseholds(_households);
      setQueue(_queueData.queue);
      setShelters(_shelters);
      setActiveSos(_sos);
    } catch (e) {
      console.error("Failed to fetch dashboard data", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    wsService.on("NEW_SOS", loadData);
    wsService.on("ZONE_RISK_UPDATED", loadData);
    return () => {
      wsService.off("NEW_SOS", loadData);
      wsService.off("ZONE_RISK_UPDATED", loadData);
    };
  }, []);

  return {
    zones,
    households,
    queue,
    shelters,
    activeSos,
    loading,
    refreshData: loadData,
  };
};

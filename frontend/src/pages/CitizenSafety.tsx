import React from 'react';
import { AlertTriangle, MapPin, Navigation, Home as HomeIcon, PhoneCall, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { useDisasterData } from '../hooks/useDisasterData';

export const CitizenSafety: React.FC = () => {
  const { shelters } = useDisasterData();
  const nearestShelter = shelters.length > 0 ? shelters[0] : null;

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto font-sans text-white pb-20">
      <div className="bg-[#1c1c1e] p-4 flex justify-between items-center sticky top-0 z-50">
        <div>
           <h1 className="font-black text-lg tracking-widest uppercase">SAFETY TAB</h1>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-lg mx-auto w-full flex flex-col gap-6">
        
        {/* CURRENT RISK */}
        <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e]">
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-2">CURRENT RISK</p>
          <div className="flex justify-between items-start">
             <div>
               <p className="text-danger font-black text-3xl tracking-tight">HIGH</p>
               <p className="text-sm font-bold text-white mt-1">Landslide Risk</p>
             </div>
             <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
               <AlertTriangle className="w-6 h-6 text-danger" />
             </div>
          </div>
        </div>

        {/* ACTIVE ALERTS */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 ml-2">ACTIVE ALERTS</p>
          <div className="bg-warning/10 border border-warning/30 rounded-2xl p-4 flex items-start gap-3">
             <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
             <div>
                <p className="text-sm font-bold text-white uppercase tracking-widest">Landslide Warning</p>
                <p className="text-xs text-gray-300 mt-1">High risk detected in your area. Avoid steep slopes and follow marked safe routes.</p>
             </div>
          </div>
        </div>

        {/* EMERGENCY INSTRUCTIONS */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 ml-2">EMERGENCY INSTRUCTIONS: LANDSLIDE</p>
          <div className="bg-[#1c1c1e] rounded-2xl border border-[#2c2c2e] overflow-hidden">
             <div className="p-4 border-b border-[#2c2c2e] bg-safe/5">
                <p className="text-[10px] font-bold text-safe uppercase tracking-widest mb-3">DO:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-200"><CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" /> Move away from steep slopes</li>
                  <li className="flex items-start gap-2 text-sm text-gray-200"><CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" /> Follow marked safe routes</li>
                  <li className="flex items-start gap-2 text-sm text-gray-200"><CheckCircle2 className="w-4 h-4 text-safe shrink-0 mt-0.5" /> Stay away from blocked roads</li>
                </ul>
             </div>
             <div className="p-4 bg-danger/5">
                <p className="text-[10px] font-bold text-danger uppercase tracking-widest mb-3">DON'T:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-gray-200"><ShieldAlert className="w-4 h-4 text-danger shrink-0 mt-0.5" /> Do not cross debris</li>
                  <li className="flex items-start gap-2 text-sm text-gray-200"><ShieldAlert className="w-4 h-4 text-danger shrink-0 mt-0.5" /> Do not approach unstable slopes</li>
                  <li className="flex items-start gap-2 text-sm text-gray-200"><ShieldAlert className="w-4 h-4 text-danger shrink-0 mt-0.5" /> Do not ignore evacuation instructions</li>
                </ul>
             </div>
          </div>
        </div>

        {/* SAFE SHELTERS */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 ml-2">SAFE SHELTERS</p>
          <div className="bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-safe/10 flex items-center justify-center">
                 <HomeIcon className="w-5 h-5 text-safe" />
               </div>
               <div>
                  <p className="text-sm font-bold text-white">{nearestShelter?.name || 'Relief Center'}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">2.8 km away • Open</p>
               </div>
            </div>
            <button className="w-8 h-8 rounded-full bg-[#2c2c2e] flex items-center justify-center hover:bg-[#3a3a3c] transition-colors">
               <Navigation className="w-4 h-4 text-info" />
            </button>
          </div>
        </div>

        {/* EMERGENCY CONTACTS */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 ml-2">EMERGENCY CONTACTS</p>
          <div className="grid grid-cols-1 gap-3">
             <button className="w-full bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] flex items-center justify-between hover:bg-[#2c2c2e] transition-colors text-left">
                <div>
                   <p className="text-sm font-bold text-white">NDRF Emergency Line</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">National Disaster Response</p>
                </div>
                <PhoneCall className="w-5 h-5 text-danger" />
             </button>
             <button className="w-full bg-[#1c1c1e] rounded-2xl p-4 border border-[#2c2c2e] flex items-center justify-between hover:bg-[#2c2c2e] transition-colors text-left">
                <div>
                   <p className="text-sm font-bold text-white">Medical Assistance</p>
                   <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Ambulance & First Aid</p>
                </div>
                <PhoneCall className="w-5 h-5 text-danger" />
             </button>
          </div>
        </div>

      </div>
    </div>
  );
};

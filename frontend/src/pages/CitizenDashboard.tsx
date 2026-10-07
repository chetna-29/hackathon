import React, { useState, useEffect } from 'react';
import { ShieldAlert, MapPin, Activity, Navigation, Radio, CheckCircle2, PhoneCall, Home, Info, Heart, Share2, AlertTriangle, ChevronRight, Zap, ArrowRight, Ambulance } from 'lucide-react';
import { useDisasterData } from '../hooks/useDisasterData';

export const CitizenDashboard: React.FC = () => {
  const { shelters, activeSos } = useDisasterData();
  const [sosState, setSosState] = useState<'IDLE' | 'HOLDING' | 'TRANSMITTING' | 'SENT'>('IDLE');
  const [holdProgress, setHoldProgress] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  // For demo: randomly drop network to show offline mesh capability
  useEffect(() => {
    const timer = setInterval(() => {
      setIsOffline(prev => !prev);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  const hasActiveSos = activeSos.some(s => s.household_code === 'H104') || sosState === 'SENT';

  const handlePointerDown = () => {
    if (hasActiveSos) return;
    setSosState('HOLDING');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setHoldProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        triggerSos();
      }
    }, 100);

    const handlePointerUp = () => {
      clearInterval(interval);
      if (progress < 100 && sosState !== 'TRANSMITTING') {
        setSosState('IDLE');
        setHoldProgress(0);
      }
      document.removeEventListener('pointerup', handlePointerUp);
    };
    document.addEventListener('pointerup', handlePointerUp);
  };

  const triggerSos = () => {
    setSosState('TRANSMITTING');
    setHoldProgress(100);
    setTimeout(() => {
      setSosState('SENT');
    }, 3000);
  };

  const nearestShelter = shelters.length > 0 ? shelters[0] : null;

  // --- SUB-COMPONENTS ---
  const SOSButton = () => (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative">
        {/* Progress Ring */}
        {sosState === 'HOLDING' && (
          <svg className="absolute -inset-4 w-[calc(100%+2rem)] h-[calc(100%+2rem)] -rotate-90 pointer-events-none">
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke="rgba(255,59,48,0.2)" strokeWidth="6" />
            <circle cx="50%" cy="50%" r="48%" fill="none" stroke="#FF3B30" strokeWidth="6" strokeDasharray="300" strokeDashoffset={300 - (300 * holdProgress) / 100} className="transition-all duration-100 ease-linear" />
          </svg>
        )}

        <button 
          onPointerDown={handlePointerDown}
          onContextMenu={(e) => e.preventDefault()}
          className={`relative w-48 h-48 md:w-56 md:h-56 rounded-full flex flex-col items-center justify-center transition-all duration-300 select-none shadow-2xl z-10 
            ${sosState === 'TRANSMITTING' 
              ? 'bg-[#FF9F0A] text-black shadow-[0_0_50px_rgba(255,159,10,0.6)] animate-pulse border-4 border-[#FF9F0A]' 
              : 'bg-gradient-to-b from-gray-800 to-[#1c1c1e] text-danger border-[6px] border-[#2c2c2e] hover:border-danger hover:shadow-[0_0_40px_rgba(255,59,48,0.4)]'
            }`}
          style={{ touchAction: 'none' }}
        >
          {sosState === 'TRANSMITTING' ? (
            <>
              <Radio className="w-12 h-12 mb-2 animate-ping" />
              <span className="font-bold text-sm tracking-widest text-center px-4">TRANSMITTING<br/>VIA MESH...</span>
            </>
          ) : (
            <>
              <ShieldAlert className={`w-16 h-16 md:w-20 md:h-20 mb-2 ${sosState === 'HOLDING' ? 'scale-110 transition-transform' : 'animate-[pulse_3s_ease-in-out_infinite]'}`} strokeWidth={1.5} />
              <span className="font-black text-4xl tracking-widest mb-1">SOS</span>
              <span className="text-[10px] uppercase font-bold text-gray-400">Press & Hold</span>
            </>
          )}
        </button>
      </div>
    </div>
  );

  const SOSActiveCard = () => (
    <div className="bg-danger/10 border-2 border-danger rounded-2xl p-5 shadow-[0_0_30px_rgba(255,59,48,0.2)]">
      <div className="flex items-center gap-3 mb-4">
        <ShieldAlert className="w-8 h-8 text-danger animate-pulse" />
        <div>
          <h2 className="text-xl font-black text-danger tracking-widest uppercase">SOS ACTIVE</h2>
          <p className="text-xs text-danger font-bold uppercase tracking-widest">Priority: HIGH / CRITICAL</p>
        </div>
      </div>
      
      <div className="bg-black/40 rounded-xl p-4 mb-4 border border-danger/20">
        <div className="flex items-start gap-2 mb-3">
          <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-white">Chamoli (Demo Location)</p>
        </div>
        
        <div className="space-y-3 relative before:absolute before:inset-y-2 before:left-2 before:w-[2px] before:bg-danger/30 pl-6">
          <div className="relative">
            <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-danger"></span>
            <p className="text-xs text-gray-300 font-bold">Signal transmitted via Mesh</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-danger"></span>
            <p className="text-xs text-gray-300 font-bold">Command Center notified</p>
          </div>
          <div className="relative">
            <span className="absolute -left-[23px] top-1 w-2.5 h-2.5 rounded-full bg-warning animate-pulse shadow-[0_0_8px_rgba(255,159,10,0.8)]"></span>
            <p className="text-xs text-white font-bold">Rescue team assigned (DEMO)</p>
            <p className="text-[10px] text-warning font-bold mt-1 uppercase tracking-widest">Team Alpha • ETA: 12 MIN</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <button className="w-full bg-white text-danger font-bold py-3.5 rounded-xl text-sm uppercase tracking-widest shadow-lg flex justify-center items-center gap-2">
          <PhoneCall className="w-4 h-4" /> Call Emergency Services
        </button>
        <div className="flex gap-2">
           <button className="flex-1 bg-black/50 border border-danger/30 text-white font-bold py-3 rounded-xl text-xs uppercase tracking-widest">
             View Rescue Status
           </button>
           <button className="flex-1 bg-black/50 border border-gray-700 text-gray-400 font-bold py-3 rounded-xl text-xs uppercase tracking-widest hover:text-white">
             Cancel SOS
           </button>
        </div>
      </div>
    </div>
  );

  const SafetyCenter = () => (
    <div className="flex flex-col gap-4">
      {/* Current Risk */}
      <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e]">
        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Safety Center</p>
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[10px] text-gray-400 uppercase font-bold">Current Risk</p>
            <p className="text-danger font-black text-2xl tracking-tight">HIGH</p>
            <p className="text-sm font-bold text-white mt-1">Landslide Risk</p>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><MapPin className="w-3 h-3"/> Chamoli, Uttarakhand</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center">
             <AlertTriangle className="w-6 h-6 text-danger" />
          </div>
        </div>
        <div className="bg-black/30 rounded-xl p-3 border border-[#2c2c2e]">
           <p className="text-[10px] text-gray-500 uppercase font-bold mb-2">Risk Factors</p>
           <ul className="text-xs text-gray-300 space-y-1.5 font-medium">
             <li>• Heavy rainfall expected</li>
             <li>• Slope instability detected</li>
             <li>• Road blockage on Route 4</li>
           </ul>
        </div>
      </div>
      
      {/* Nearest Safe Shelter */}
      <div className="bg-[#1c1c1e] rounded-2xl p-5 border border-[#2c2c2e]">
         <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Nearest Safe Shelter</p>
              <p className="text-lg font-bold text-white leading-tight">{nearestShelter?.name || 'Govt Relief Center'}</p>
              <p className="text-sm text-info font-bold mt-1">2.8 km away</p>
            </div>
            <div className="bg-safe/20 border border-safe/30 px-2 py-1 rounded text-[10px] text-safe font-bold uppercase flex items-center gap-1">
               <span className="w-1.5 h-1.5 rounded-full bg-safe"></span> OPEN
            </div>
         </div>
         <div className="flex justify-between text-xs text-gray-400 font-medium mb-4 bg-black/30 p-3 rounded-xl border border-[#2c2c2e]">
            <div className="flex flex-col"><span className="text-[10px] uppercase">Capacity</span><span className="text-white font-bold">{nearestShelter?.capacity || 120}</span></div>
            <div className="flex flex-col"><span className="text-[10px] uppercase">Available</span><span className="text-safe font-bold">{nearestShelter?.available_beds || 64}</span></div>
         </div>
         <button className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
            <Navigation className="w-4 h-4 text-info" /> Get Safe Route
         </button>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: <Navigation className="w-6 h-6 text-info" />, label: 'Safe Route' },
          { icon: <HomeIcon className="w-6 h-6 text-safe" />, label: 'Find Shelter' },
          { icon: <Share2 className="w-6 h-6 text-gray-300" />, label: 'Share Location' },
          { icon: <PhoneCall className="w-6 h-6 text-danger" />, label: 'Emergency Contact' },
        ].map((action, i) => (
           <button key={i} className="bg-[#1c1c1e] border border-[#2c2c2e] hover:bg-[#2c2c2e] rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-colors h-28">
             {action.icon}
             <span className="text-[10px] font-bold text-white uppercase tracking-widest text-center">{action.label}</span>
           </button>
        ))}
      </div>

      {/* Active Alert */}
      <div className="bg-warning/10 border-2 border-warning/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-6 h-6 text-warning shrink-0" />
          <div>
            <p className="text-[10px] font-bold text-warning uppercase tracking-widest mb-1">Active Alert</p>
            <p className="text-sm font-bold text-white uppercase tracking-wider">Landslide Warning</p>
            <p className="text-xs text-gray-300 mt-1 mb-3">High risk detected in your area (Chamoli district).</p>
            <button className="text-[10px] font-bold text-warning uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors">
              View Safety Instructions <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-black overflow-hidden font-sans text-white">
      
      {/* Top Header */}
      <div className="bg-[#1c1c1e] p-4 flex justify-between items-center shrink-0 z-50">
        <div>
          <h1 className="font-black text-lg tracking-widest uppercase flex items-center gap-1">
            FIRE<span className="text-danger">-</span>EYE
          </h1>
          <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Emergency Protection</p>
        </div>
        
        {/* Connection Status */}
        {isOffline ? (
          <div className="flex items-center gap-1.5 bg-[#2c2c2e] border border-gray-600 px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-info shadow-[0_0_8px_rgba(0,212,255,0.8)] animate-pulse"></span>
            <div className="flex flex-col">
              <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest leading-none">Cellular Offline</span>
              <span className="text-[9px] font-bold text-info uppercase tracking-widest leading-none mt-0.5">Mesh Active</span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-[#2c2c2e] border border-[#3a3a3c] px-3 py-1.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_rgba(48,209,88,0.8)] animate-pulse"></span>
            <span className="text-[9px] font-bold text-safe uppercase tracking-widest">Mesh Connected</span>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {/* Desktop: 3 columns. Mobile: 1 column scrolling */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 lg:p-8 bg-black">
        
        <div className="max-w-6xl mx-auto h-full grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUMN 1: EMERGENCY SOS (Always visible first on mobile) */}
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none">
            {!hasActiveSos && (
              <div className="text-center md:text-left mt-2">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Good Evening</p>
                <h2 className="text-3xl font-black tracking-tight mb-2">ARE YOU IN DANGER?</h2>
                <p className="text-sm text-gray-400 font-medium leading-relaxed">
                  {isOffline 
                    ? "Offline Emergency Mode. Your SOS will be relayed through nearby devices via mesh." 
                    : "Send an emergency signal even when cellular connectivity is unavailable."}
                </p>
              </div>
            )}

            {hasActiveSos ? <SOSActiveCard /> : <SOSButton />}

            {/* Offline Explanation Banner */}
            {isOffline && !hasActiveSos && (
              <div className="bg-info/10 border border-info/30 rounded-xl p-4 flex items-start gap-3">
                 <Zap className="w-5 h-5 text-info shrink-0" />
                 <div>
                   <h4 className="text-[10px] font-bold text-info uppercase tracking-widest mb-1">Offline Emergency Mode</h4>
                   <p className="text-xs text-gray-300">Your emergency information is stored locally and will be transmitted via mesh network relays.</p>
                 </div>
              </div>
            )}
          </div>

          {/* COLUMN 2: SAFETY CENTER (Visible below on mobile, center on desktop) */}
          <div className="flex flex-col gap-6 w-full max-w-md mx-auto md:max-w-none">
             <SafetyCenter />
          </div>

          {/* COLUMN 3: MAP / ROUTE PREVIEW (Desktop Only or lowest on mobile) */}
          <div className="hidden md:flex flex-col gap-6 bg-[#1c1c1e] rounded-2xl border border-[#2c2c2e] overflow-hidden">
             {/* Map Placeholder for Safety Route */}
             <div className="flex-1 bg-gray-900 relative">
                <div className="absolute inset-0 opacity-50 bg-[url('/hero-bg.jpg')] bg-cover bg-center filter grayscale-[0.8] brightness-50"></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col gap-2 p-8 text-center z-10">
                   <div className="w-12 h-12 rounded-full bg-info/20 flex items-center justify-center border border-info/50 shadow-[0_0_20px_rgba(0,212,255,0.4)]">
                     <MapPin className="w-5 h-5 text-info" />
                   </div>
                   <h3 className="text-sm font-bold text-white uppercase tracking-widest">Safe Route Map</h3>
                   <p className="text-xs text-gray-400">Select "Get Safe Route" to view the safest path to the nearest open shelter avoiding disaster zones.</p>
                </div>
             </div>
             
             {/* Bottom Map Info (Demo Route) */}
             <div className="p-5 bg-[#1c1c1e] border-t border-[#2c2c2e]">
               <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Safe Route (DEMO)</h3>
               <div className="flex justify-between items-center mb-4">
                 <div>
                   <p className="text-xl font-bold text-white">2.8 km</p>
                   <p className="text-xs text-gray-400">Distance</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xl font-bold text-white">11 min</p>
                   <p className="text-xs text-gray-400">Estimated time</p>
                 </div>
               </div>
               <div className="flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg mb-4">
                 <AlertTriangle className="w-4 h-4 text-warning" />
                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Avoiding: Landslide Zone</span>
               </div>
               <button className="w-full bg-safe text-black font-bold py-3.5 rounded-xl text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(48,209,88,0.3)] flex justify-center items-center gap-2">
                 <Navigation className="w-4 h-4" /> Start Navigation
               </button>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

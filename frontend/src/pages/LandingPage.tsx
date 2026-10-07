import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, MapPin, ChevronRight, Activity, ShieldCheck } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen bg-[#05080D] overflow-hidden flex flex-col font-sans text-gray-200">
      
      {/* Background Cinematic Atmosphere */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544253303-34e819b1bb4a?q=80&w=2000')] bg-cover bg-center opacity-20 filter grayscale blur-sm"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-[#05080D]/80 via-[#05080D]/90 to-[#05080D]"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')]"></div>
      </div>

      {/* Top Status */}
      <div className="absolute top-8 left-8 right-8 z-20 flex justify-between items-center text-xs tracking-widest font-mono">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-danger" />
          <span className="font-bold text-white text-xl tracking-[0.2em]">FIRE-EYE</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-safe shadow-[0_0_8px_rgba(48,209,88,0.8)] animate-pulse"></span>
            <span className="text-safe font-bold uppercase">SYSTEM READY</span>
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <MapPin className="w-4 h-4 text-info" />
            <span className="uppercase">UTTARAKHAND, INDIA</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center mt-12">
        
        <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <p className="text-info font-mono text-sm tracking-[0.3em] mb-4 uppercase">Fault-Tolerant Intelligent Response & Emergency Eye</p>
          
          <h1 className="text-5xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight drop-shadow-2xl">
            WHEN DISASTER STRIKES,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">EVERY SECOND MATTERS.</span>
          </h1>
          
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-light">
            One platform connecting people in danger with the responders who can help them.
          </p>

          <div className="flex items-center gap-4 justify-center mb-12">
            <div className="h-[1px] w-12 bg-gray-600"></div>
            <p className="text-sm font-bold tracking-widest uppercase text-white">HOW DO YOU WANT TO CONTINUE?</p>
            <div className="h-[1px] w-12 bg-gray-600"></div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          
          {/* Responder Card */}
          <div 
            onClick={() => navigate('/dashboard')}
            className="group cinematic-card relative overflow-hidden rounded-2xl border border-gray-800 p-8 cursor-pointer text-left flex flex-col hover:border-danger/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-danger/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-danger/20"></div>
            
            <div className="w-16 h-16 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform glow-danger">
              <ShieldCheck className="w-8 h-8 text-danger" />
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-3">I'm a Responder</h2>
            <p className="text-gray-400 font-light mb-8 flex-1">
              Coordinate emergency response operations, monitor active disasters, and dispatch rescue teams from the Command Center.
            </p>
            
            <div className="flex items-center gap-2 text-danger font-bold text-xs tracking-widest uppercase mt-auto">
              ENTER COMMAND CENTER <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Citizen Card */}
          <div 
            onClick={() => navigate('/citizen')}
            className="group cinematic-card relative overflow-hidden rounded-2xl border border-gray-800 p-8 cursor-pointer text-left flex flex-col hover:border-safe/50"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-safe/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-safe/20"></div>
            
            <div className="w-16 h-16 rounded-xl bg-safe/10 border border-safe/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_15px_rgba(48,209,88,0.3)]">
              <Activity className="w-8 h-8 text-safe" />
            </div>
            
            <h2 className="text-2xl font-black text-white tracking-widest uppercase mb-3">I Need Help</h2>
            <p className="text-gray-400 font-light mb-8 flex-1">
              Send an emergency SOS even without internet, share your location, and find the safest evacuation route to a shelter.
            </p>
            
            <div className="flex items-center gap-2 text-safe font-bold text-xs tracking-widest uppercase mt-auto">
              GET EMERGENCY HELP <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>

      <div className="absolute bottom-8 left-0 right-0 text-center text-[10px] text-gray-600 font-mono tracking-widest uppercase pointer-events-none">
        SECURE CONNECTION ESTABLISHED // ENCRYPTED RELAY ACTIVE // FIRE-EYE V2.0
      </div>
    </div>
  );
};

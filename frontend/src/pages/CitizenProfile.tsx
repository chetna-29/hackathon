import React, { useState } from 'react';
import { User, Phone, Edit2, Shield, HeartPulse, Accessibility, Users, ChevronRight } from 'lucide-react';

export const CitizenProfile: React.FC = () => {
  const [profile] = useState({
    name: 'Aman',
    phone: '+91 98765 43210',
    emergencyContact: '+91 98765 11111',
    household: {
      elderly: 1,
      children: 1,
      medicalDependency: 1,
      disability: 0
    }
  });

  return (
    <div className="flex flex-col h-full bg-black overflow-y-auto font-sans text-white pb-20">
      <div className="bg-[#1c1c1e] p-4 flex justify-between items-center sticky top-0 z-50">
        <div>
           <h1 className="font-black text-lg tracking-widest uppercase">MY PROFILE</h1>
        </div>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-lg mx-auto w-full flex flex-col gap-6">
        
        {/* EMERGENCY PROFILE */}
        <div>
          <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest mb-3 ml-2">EMERGENCY PROFILE</p>
          <div className="bg-[#1c1c1e] rounded-2xl border border-[#2c2c2e] overflow-hidden">
             
             <div className="p-4 border-b border-[#2c2c2e] flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-800 flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                   <p className="text-sm font-bold text-gray-400">Name</p>
                   <p className="text-lg font-bold text-white">{profile.name}</p>
                </div>
             </div>

             <div className="p-4 border-b border-[#2c2c2e] flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-800/50 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                   <p className="text-xs font-bold text-gray-400">Phone</p>
                   <p className="text-sm font-bold text-white tracking-wider">{profile.phone}</p>
                </div>
             </div>

             <div className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-danger" />
                </div>
                <div>
                   <p className="text-xs font-bold text-danger">Emergency Contact</p>
                   <p className="text-sm font-bold text-white tracking-wider">{profile.emergencyContact}</p>
                </div>
             </div>
             
          </div>
        </div>

        {/* HOUSEHOLD VULNERABILITY */}
        <div>
          <div className="flex justify-between items-end mb-3 ml-2 mr-2">
            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">HOUSEHOLD VULNERABILITY</p>
          </div>
          
          <div className="bg-[#1c1c1e] rounded-2xl border border-[#2c2c2e] overflow-hidden p-2">
             <div className="bg-info/10 border border-info/20 rounded-xl p-3 mb-2">
                <p className="text-xs text-info font-medium text-center">
                  This information helps responders prioritize assistance during an emergency.
                </p>
             </div>

             <div className="space-y-1">
                {/* Elderly */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c2c2e] transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-sm">👵</span>
                      </div>
                      <span className="text-sm font-bold text-gray-200">Elderly</span>
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-black border border-[#3a3a3c] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{profile.household.elderly}</span>
                   </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c2c2e] transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <span className="text-sm">👶</span>
                      </div>
                      <span className="text-sm font-bold text-gray-200">Children</span>
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-black border border-[#3a3a3c] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{profile.household.children}</span>
                   </div>
                </div>

                {/* Disability */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c2c2e] transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <Accessibility className="w-4 h-4 text-gray-400" />
                      </div>
                      <span className="text-sm font-bold text-gray-200">Disability</span>
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-black border border-[#3a3a3c] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{profile.household.disability}</span>
                   </div>
                </div>

                {/* Medical Dependency */}
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-[#2c2c2e] transition-colors">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <HeartPulse className="w-4 h-4 text-danger" />
                      </div>
                      <span className="text-sm font-bold text-gray-200">Medical Dependency</span>
                   </div>
                   <div className="w-8 h-8 rounded-lg bg-black border border-[#3a3a3c] flex items-center justify-center">
                      <span className="text-sm font-bold text-white">{profile.household.medicalDependency}</span>
                   </div>
                </div>
             </div>
          </div>
        </div>

        <button className="w-full bg-[#2c2c2e] hover:bg-[#3a3a3c] text-white font-bold py-4 rounded-2xl text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2 mt-4">
           <Edit2 className="w-4 h-4" /> Edit Emergency Details
        </button>

      </div>
    </div>
  );
};

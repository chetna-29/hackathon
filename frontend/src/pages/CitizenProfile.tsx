import React, { useState } from "react";
import { User, Phone, Shield, HeartPulse, Accessibility, Save, Edit3 } from "lucide-react";

export const CitizenProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Aman",
    phone: "+91 98765 43210",
    emergencyContact: "+91 98765 11111",
    household: {
      elderly: 1,
      children: 1,
      medicalDependency: 1,
      disability: 0,
    },
  });

  const handleChange = (field: string, value: string, isHousehold: boolean = false) => {
    if (isHousehold) {
      setProfile(prev => ({
        ...prev,
        household: {
          ...prev.household,
          [field]: parseInt(value) || 0
        }
      }));
    } else {
      setProfile(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    // In a real app, this would also make an API call to save the profile
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-black overflow-y-auto font-sans text-gray-900 dark:text-gray-100 pb-20">
      <div className="bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-zinc-800 p-4 sticky top-0 z-50 flex justify-between items-center">
        <h1 className="text-xl font-medium tracking-tight">My Profile</h1>
      </div>

      <div className="p-4 md:p-6 lg:p-8 max-w-lg mx-auto w-full flex flex-col gap-6">
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-sm font-medium text-gray-500 dark:text-gray-500 uppercase tracking-wider">Emergency Profile</h2>
          </div>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm dark:shadow-none overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-4">
              <div className="w-12 h-12 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500 dark:text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 dark:text-gray-500">Name</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-lg font-medium">{profile.name}</p>
                )}
              </div>
            </div>

            <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center shrink-0">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="w-full mt-1 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 transition-colors"
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.phone}</p>
                )}
              </div>
            </div>

            <div className="p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded bg-red-50 flex items-center justify-center shrink-0">
                <Shield className="w-4 h-4 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-red-600">Emergency Contact</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profile.emergencyContact}
                    onChange={(e) => handleChange("emergencyContact", e.target.value)}
                    className="w-full mt-1 bg-red-50 dark:bg-zinc-900 border border-red-200 dark:border-zinc-700 rounded px-2 py-1 text-sm outline-none focus:border-red-500 transition-colors"
                  />
                ) : (
                  <p className="text-sm font-medium">{profile.emergencyContact}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-500 mb-3 uppercase tracking-wider">Household Vulnerability</h2>
          <div className="bg-white dark:bg-[#0a0a0a] rounded-lg border border-gray-200 dark:border-zinc-800 overflow-hidden p-4 shadow-sm dark:shadow-none">
            <p className="text-sm text-gray-600 dark:text-gray-400 p-3 rounded border border-gray-200 dark:border-zinc-800 mb-4 bg-gray-50 dark:bg-zinc-900/50">
              This information helps responders prioritize assistance during an emergency.
            </p>

            <div className="space-y-2">
              <div className="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:bg-black border border-transparent hover:border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="text-sm">👵</span>
                  <span className="text-sm font-medium">Elderly</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={profile.household.elderly}
                    onChange={(e) => handleChange("elderly", e.target.value, true)}
                    className="w-16 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile.household.elderly}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:bg-black border border-transparent hover:border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <span className="text-sm">👶</span>
                  <span className="text-sm font-medium">Children</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={profile.household.children}
                    onChange={(e) => handleChange("children", e.target.value, true)}
                    className="w-16 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile.household.children}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:bg-black border border-transparent hover:border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <Accessibility className="w-4 h-4 text-gray-500 dark:text-gray-500" />
                  <span className="text-sm font-medium">Disability</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={profile.household.disability}
                    onChange={(e) => handleChange("disability", e.target.value, true)}
                    className="w-16 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile.household.disability}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between p-3 rounded hover:bg-gray-50 dark:bg-black border border-transparent hover:border-gray-200 dark:border-zinc-800">
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium">Medical Dependency</span>
                </div>
                {isEditing ? (
                  <input
                    type="number"
                    min="0"
                    value={profile.household.medicalDependency}
                    onChange={(e) => handleChange("medicalDependency", e.target.value, true)}
                    className="w-16 bg-gray-50 dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded px-2 py-1 text-sm text-center outline-none focus:border-blue-500"
                  />
                ) : (
                  <div className="w-8 h-8 rounded bg-gray-100 dark:bg-zinc-900 flex items-center justify-center text-sm font-medium text-gray-900 dark:text-gray-100">
                    {profile.household.medicalDependency}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {isEditing ? (
          <button 
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded text-sm transition-colors mt-2"
          >
            <Save className="w-4 h-4" />
            Save Emergency Details
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="w-full flex items-center justify-center gap-2 bg-gray-100 dark:bg-zinc-900 hover:bg-gray-200 dark:bg-zinc-800 text-gray-900 dark:text-gray-100 font-medium py-3 rounded text-sm transition-colors mt-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Emergency Details
          </button>
        )}
      </div>
    </div>
  );
};


import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShieldCheck, Activity, ArrowLeft } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { role } = useParams<{ role: string }>(); // 'responder' or 'citizen'
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  const isResponder = role === 'responder';
  
  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock authentication - route based on role
    if (isResponder) {
      navigate('/dashboard');
    } else {
      navigate('/citizen');
    }
  };

  return (
    <div className="min-h-screen bg-[#05080D] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-gray-200">
      
      {/* Background FX */}
      <div className={`absolute top-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-20 pointer-events-none ${isResponder ? 'bg-danger left-0 -translate-x-1/2 -translate-y-1/2' : 'bg-safe right-0 translate-x-1/2 -translate-y-1/2'}`}></div>

      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Entry
      </button>

      <div className="cinematic-card w-full max-w-md p-8 rounded-2xl border border-gray-800 relative z-10 animate-fade-in-up">
        
        <div className="flex flex-col items-center mb-8">
          <div className={`w-16 h-16 rounded-xl border flex items-center justify-center mb-4 ${
            isResponder ? 'bg-danger/10 border-danger/20 text-danger shadow-[0_0_20px_rgba(255,59,48,0.3)]' : 'bg-safe/10 border-safe/20 text-safe shadow-[0_0_20px_rgba(48,209,88,0.3)]'
          }`}>
            {isResponder ? <ShieldCheck className="w-8 h-8" /> : <Activity className="w-8 h-8" />}
          </div>
          <h2 className="text-2xl font-black text-white tracking-widest uppercase text-center">
            {isResponder ? 'Responder Auth' : 'Citizen Portal'}
          </h2>
          <p className="text-gray-400 text-xs mt-2 uppercase tracking-widest font-mono">
            {isLogin ? 'Enter Credentials' : 'Create Account'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          
          {!isLogin && (
            <div>
              <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Full Name</label>
              <input type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="John Doe" />
            </div>
          )}

          {isResponder ? (
            <>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Email Address</label>
                <input type="email" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="responder@agency.gov" />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Organization / Team ID</label>
                  <input type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="NDRF-UK-04" />
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Phone / Email</label>
                <input type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="+91 98765 43210" />
              </div>
              {!isLogin && (
                <div>
                  <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Emergency Contact</label>
                  <input type="text" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="+91 91234 56789" />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Password</label>
            <input type="password" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-info transition-colors" placeholder="••••••••" />
          </div>

          <button 
            type="submit" 
            className={`w-full py-4 rounded-lg font-bold tracking-widest text-sm uppercase transition-all mt-4 text-white shadow-lg ${
              isResponder ? 'bg-danger hover:bg-danger-dark shadow-danger/30' : 'bg-info hover:bg-info/80 shadow-info/30 text-black'
            }`}
          >
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>

        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {isLogin ? "Don't have an account? Create one." : "Already have an account? Sign in."}
          </button>
        </div>

      </div>
    </div>
  );
};

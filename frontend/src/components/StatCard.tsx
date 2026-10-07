import React from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  isDonut?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, isDonut }) => {
  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 flex items-center gap-4 flex-1 h-24">
      {isDonut ? (
        <div className="relative w-14 h-14 shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <path className="text-gray-800" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
            <path className="text-danger" strokeDasharray={`${value}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
          </svg>
        </div>
      ) : (
        icon && <div className="p-3 bg-gray-800/50 rounded-full">{icon}</div>
      )}
      
      <div className="flex flex-col">
        <span className="text-gray-400 text-[10px] font-bold tracking-normal uppercase mb-1">{label}</span>
        <span className={`text-3xl font-bold leading-none ${isDonut ? 'text-danger' : 'text-white'}`}>
          {value}{isDonut && '%'}
        </span>
      </div>
    </div>
  );
};

export const WeatherCard: React.FC = () => {
  const [weather, setWeather] = React.useState<{temp: number, desc: string, risk: string} | null>(null);

  React.useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await fetch('https://api.openweathermap.org/data/2.5/weather?lat=30.28&lon=78.98&appid=e361f603d40b295dffbcc2609f2891ee&units=metric');
        const data = await res.json();
        
        let risk = 'Low landslide risk';
        const rain1h = data.rain ? data.rain['1h'] : 0;
        if (rain1h > 10 || data.weather[0].main.toLowerCase().includes('rain')) {
          risk = 'High landslide risk';
        }

        setWeather({
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description,
          risk: risk
        });
      } catch (e) {
        console.error('Failed to fetch weather', e);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 300000); // 5 mins
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-900/80 border border-gray-800 rounded-lg p-4 flex items-center justify-between flex-1 h-24">
      <div className="flex items-center gap-3">
        {/* Simple SVG for cloud/sun based on data */}
        <svg className="w-10 h-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.5 19c-2.485 0-4.5-2.015-4.5-4.5 0-.256.022-.507.063-.751A5.485 5.485 0 0 0 8.5 15c-3.038 0-5.5-2.462-5.5-5.5S5.462 4 8.5 4c1.192 0 2.296.38 3.195 1.026C12.564 2.802 14.646 1 17 1c3.314 0 6 2.686 6 6 0 1.258-.387 2.425-1.05 3.385C22.604 11.085 23 11.996 23 13c0 2.21-1.79 4-4 4h-1.5zm-5 2v3h-2v-3h2zm4 0v3h-2v-3h2zm-8 0v3H2.5v-3h2z"/>
        </svg>
        <div>
          <h4 className="font-bold text-sm text-white uppercase tracking-normal">Rudraprayag</h4>
          <p className="text-xs text-gray-400 capitalize">{weather ? weather.desc : 'Loading...'}</p>
          <p className="text-[10px] text-gray-500">{weather ? weather.risk : '...'}</p>
        </div>
      </div>
      <div className="text-3xl font-bold text-white">
        {weather ? `${weather.temp}°C` : '--'}
      </div>
    </div>
  );
};

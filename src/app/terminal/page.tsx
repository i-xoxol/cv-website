'use client';

import { useEffect, useState } from 'react';

interface Stats {
  timestamp: string;
  mac: {
    hostname: string;
    temp: string;
    disk: string;
  };
  lenovo: {
    hostname: string;
    temp: string;
    mem_used: string;
    mem_total: string;
    disk: string;
    ext_disk: string;
  };
}

export default function TerminalPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await fetch('/system-stats.json', { cache: 'no-store' });
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('Failed to fetch stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8">
      <div className="max-w-4xl mx-auto">
        <header className="border-b border-green-900 pb-4 mb-8">
          <h1 className="text-2xl font-bold">📡 DIGOR SYSTEM TERMINAL v2.0</h1>
          <p className="text-xs opacity-70">LOCATION: SUNROOM LAB | STATUS: MONITORING ACTIVE</p>
          {stats && <p className="text-xs mt-2 text-green-800">LAST SYNC: {new Date(stats.timestamp).toLocaleString()}</p>}
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* MAC MINI */}
          <section className="border border-green-900 p-6 rounded-lg bg-green-950/10">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              MAC MINI (Local Controller)
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">HOSTNAME:</span>
                <span>{stats?.mac.hostname || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">CPU TEMP:</span>
                <span className={Number(stats?.mac.temp) > 70 ? 'text-red-500 font-bold' : ''}>
                  {stats?.mac.temp ? `${stats.mac.temp}°C` : '---'}
                </span>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">DISK USAGE (/):</span>
                <div className="flex items-center gap-2 w-1/2">
                  <div className="flex-grow bg-green-900/30 h-2 rounded-full overflow-hidden border border-green-900/50">
                    <div 
                      className="bg-green-500 h-full transition-all duration-1000" 
                      style={{ width: `${stats?.mac.disk || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{stats?.mac.disk || 0}%</span>
                </div>
              </div>
            </div>
          </section>

          {/* LENOVO LAPTOP */}
          <section className="border border-green-900 p-6 rounded-lg bg-green-950/10">
            <h2 className="text-xl mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span>
              LENOVO U31-70 (Ubuntu Node)
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">HOSTNAME:</span>
                <span>{stats?.lenovo.hostname || '---'}</span>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">CPU TEMP:</span>
                <span className={Number(stats?.lenovo.temp) < 10 ? 'text-blue-400 font-bold' : ''}>
                  {stats?.lenovo.temp ? `${stats.lenovo.temp}°C` : '---'}
                  {Number(stats?.lenovo.temp) < 10 && ' ❄️'}
                </span>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">MEMORY:</span>
                <span>{stats ? `${stats.lenovo.mem_used}MB / ${stats.lenovo.mem_total}MB` : '---'}</span>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70">OS DISK (/):</span>
                <div className="flex items-center gap-2 w-1/2">
                  <div className="flex-grow bg-green-900/30 h-2 rounded-full overflow-hidden border border-green-900/50">
                    <div 
                      className="bg-blue-500 h-full transition-all duration-1000" 
                      style={{ width: `${stats?.lenovo.disk || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{stats?.lenovo.disk || 0}%</span>
                </div>
              </div>
              <div className="flex justify-between border-b border-green-900/30 pb-1">
                <span className="opacity-70 text-blue-400 font-bold">EXTERNAL HDD (14TB):</span>
                <div className="flex items-center gap-2 w-1/2">
                  <div className="flex-grow bg-green-900/30 h-2 rounded-full overflow-hidden border border-green-900/50">
                    <div 
                      className="bg-blue-400 h-full transition-all duration-1000" 
                      style={{ width: `${stats?.lenovo.ext_disk || 0}%` }}
                    ></div>
                  </div>
                  <span className="text-xs">{stats?.lenovo.ext_disk || 0}%</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-12 text-[10px] opacity-40 text-center uppercase tracking-widest">
          Integrated Digital Igor (DIgor) Laboratory Monitoring System | Hamden, CT
        </footer>
      </div>
    </div>
  );
}

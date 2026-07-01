import { useEffect, useState } from 'react';
import { Activity, Server } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('/api/health');
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setStatus(data);
        setError('');
      } catch (e) {
        setError('Cannot reach bot server. Is it running?');
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-neutral-800 rounded-2xl flex items-center justify-center mb-4 border border-neutral-700 shadow-inner">
            <Server className="w-8 h-8 text-neutral-400" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Swiftbot Engine</h1>
          <p className="text-neutral-500 mt-1 text-sm">System Diagnostics & Heartbeat</p>
        </div>

        {error ? (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-4 text-center">
            <p className="text-red-400 text-sm font-medium">{error}</p>
          </div>
        ) : status ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
              <span className="text-sm text-neutral-400 font-medium">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-mono text-emerald-400">{status.status.toUpperCase()}</span>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
              <span className="text-sm text-neutral-400 font-medium">Engine</span>
              <span className="text-sm font-mono text-neutral-300">{status.bot}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-neutral-800/50 rounded-xl border border-neutral-700/50">
              <span className="text-sm text-neutral-400 font-medium">Uptime</span>
              <div className="flex items-center gap-2 text-neutral-300">
                <Activity className="w-4 h-4 text-neutral-500" />
                <span className="text-sm font-mono">
                  {Math.floor(status.uptime / 60)}m {status.uptime % 60}s
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex justify-center p-8">
            <div className="w-6 h-6 border-2 border-neutral-600 border-t-neutral-300 rounded-full animate-spin"></div>
          </div>
        )}

      </div>
    </div>
  );
}


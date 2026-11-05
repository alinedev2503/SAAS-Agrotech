import { useNavigate } from 'react-router-dom';
import { CloudRain, TrendingUp, AlertTriangle, Droplets, Thermometer, AlertOctagon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { inventoryAlerts } from '../data/inventory';

export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const navigate = useNavigate();
  const criticalStockItems = inventoryAlerts.filter(item => item.status === 'critical_stock');

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    navigate(`/${path}`);
  };

  return (
    <div className="space-y-6">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Executive Farm Dashboard</h2>
          <p className="text-stone-500 dark:text-stone-400">
            Santa Helena Ranch & Crop Operations • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Operational Status: Normal
        </div>
      </header>

      {/* Weather & Agronomic Alerts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-r-2xl shadow-sm transition-colors">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 dark:bg-blue-900/40 p-3 rounded-2xl text-blue-600 dark:text-blue-400">
              <CloudRain size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">Weather Advisory</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100">Plot #04</span>
              </div>
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mt-1">Ground Frost Risk Detected</h3>
              <p className="text-blue-800 dark:text-blue-200 mt-1 text-sm font-medium">Temperature projected to drop below 34°F within 12 hours.</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                Recommended Action: Activate protective micro-sprinklers in Plot #04 to mitigate crop tissue freezing.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 p-6 rounded-r-2xl shadow-sm transition-colors">
          <div className="flex items-start gap-4">
            <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-2xl text-orange-600 dark:text-orange-400">
              <Thermometer size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">Herd Wellness</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100">Pen B</span>
              </div>
              <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 mt-1">Cattle Heat Stress (THI Alert)</h3>
              <p className="text-orange-800 dark:text-orange-200 mt-1 text-sm font-medium">Elevated Temperature-Humidity Index forecasted for 2:00 PM.</p>
              <p className="text-xs text-orange-600 dark:text-orange-300 mt-2">
                Action: Increase water trough throughput and verify corral shading for feedlot cattle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Market Ticker (CME / Global Agri Futures) */}
      <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-lg">Commodity Markets & Futures (Real-Time)</h3>
          </div>
          <button 
            onClick={() => handleNavigate('market')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
          >
            Full Market Analysis <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">Live Cattle (LE Futures)</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold">$188.50 <span className="text-xs font-normal text-stone-400">/cwt</span></span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> 1.2%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">Soybeans (ZS Futures)</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold">$12.45 <span className="text-xs font-normal text-stone-400">/bu</span></span>
              <span className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-0.5 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                <ArrowDownRight size={12} /> 0.5%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">Corn (ZC Futures)</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold">$4.85 <span className="text-xs font-normal text-stone-400">/bu</span></span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> 0.3%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions / Alerts */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white">Urgent Farm Action Items</h3>
          <span className="text-xs text-stone-500">{criticalStockItems.length + 2} pending alerts</span>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden divide-y divide-stone-100 dark:divide-stone-800">
          
          {/* Critical Stock Alerts */}
          {criticalStockItems.map(item => (
            <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
                  <AlertOctagon size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 dark:text-white">Critical Low Stock: {item.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    Only {item.quantity} {item.unit} remaining in warehouse. Average consumption rate: {item.avgConsumption}.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleNavigate('stock')} 
                className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0"
              >
                Restock via QR
              </button>
            </div>
          ))}

          {/* Sanitary Expiration */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 dark:bg-red-900/30 p-2.5 rounded-xl text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Vaccine Batch Nearing Expiration</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Batch of 50 doses expires in 2 days. Scheduled application required.</p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('sanitary')} 
              className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0"
            >
              Sanitary Protocol
            </button>
          </div>
          
          {/* Pump Maintenance */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">Irrigation Center Pivot #02 Maintenance</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">Scheduled preventive inspection today at 4:00 PM by Field Team.</p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('crops')} 
              className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0"
            >
              Field Details
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, Truck, CloudRain, Sun, Wind, Droplets, AlertTriangle, Newspaper } from 'lucide-react';

export default function MarketIntelligence() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const commodities = [
    { name: 'Live Cattle (CME)', price: '$188.40', unit: 'cwt', variation: '+1.2%', trend: 'up' },
    { name: 'Soybeans (CBOT)', price: '$11.65', unit: 'bu', variation: '-0.5%', trend: 'down' },
    { name: 'Corn (CBOT)', price: '$4.42', unit: 'bu', variation: '+0.4%', trend: 'up' },
    { name: 'Wheat (CBOT)', price: '$5.78', unit: 'bu', variation: '+1.8%', trend: 'up' },
  ];

  const news = [
    { 
      id: 1, 
      source: 'USDA FAS', 
      title: 'US Beef Export Demand Surges Across Asian Markets; Spot Prices Rally', 
      tag: 'Trade',
      time: '2h ago'
    },
    { 
      id: 2, 
      source: 'Farm Futures', 
      title: 'Midwest Rail Corridor Maintenance Scheduled; Grain Elevators Advised to Adjust Logistics', 
      tag: 'Logistics',
      alert: true,
      time: '35m ago'
    },
    { 
      id: 3, 
      source: 'AgWeb Markets', 
      title: 'Fertilizer Input Pricing Normalizes for Spring Planting Across Central Plains', 
      tag: 'Inputs',
      time: '4h ago'
    },
  ];

  const weatherAlerts = [
    {
      id: 1,
      type: 'Frost Risk Alert',
      risk: 'High',
      message: 'Sub-freezing ground temperatures forecast Tuesday dawn (30°F / -1°C). Check frost-sensitive crops and calibrate irrigation.',
      icon: CloudRain,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      id: 2,
      type: 'Soil Moisture Deficit',
      risk: 'Moderate',
      message: 'Cumulative moisture deficit of 0.6 in detected in topsoil layer. Supplemental center-pivot irrigation recommended.',
      icon: Sun,
      color: 'text-orange-500 dark:text-orange-400',
      bg: 'bg-orange-50 dark:bg-orange-950/30'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Market & Weather Intelligence</h2>
        <p className="text-stone-500 dark:text-stone-400">Commodity futures, agricultural trade news, and predictive weather for strategic decisions.</p>
      </header>

      {/* Commodities Ticker */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {commodities.map((item, idx) => (
          <div key={idx} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <span className="text-stone-500 dark:text-stone-400 font-medium text-sm">{item.name}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${
                item.trend === 'up' 
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
              }`}>
                {item.trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {item.variation}
              </span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-stone-900 dark:text-white">{item.price}</span>
              <span className="text-xs text-stone-400 mb-1">/{item.unit}</span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* News Feed */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
              <Globe className="text-primary" size={20} />
              Geopolitical & Logistics Radar
            </h3>
            <span className="text-xs font-bold text-stone-400 uppercase">Sources: USDA / CME / Farm Progress</span>
          </div>
          
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 divide-y divide-stone-100 dark:divide-stone-800">
            {news.map((item) => (
              <div key={item.id} className="p-5 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                    item.alert 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' 
                      : 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400'
                  }`}>
                    {item.tag}
                  </span>
                  <span className="text-xs text-stone-400">{item.time}</span>
                </div>
                <h4 className="font-bold text-lg text-stone-900 dark:text-white mb-1 group-hover:text-primary transition-colors">
                  {item.alert && <AlertTriangle className="inline mr-2 text-red-500" size={18} />}
                  {item.title}
                </h4>
                <p className="text-sm text-stone-500 dark:text-stone-400">Source: {item.source}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Climate Intelligence */}
        <section className="space-y-4">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <CloudRain className="text-blue-500" size={20} />
            Predictive Weather (AI)
          </h3>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-blue-100 text-sm font-medium">Heartland Field Station #04</p>
                <h4 className="text-3xl font-bold">78°F <span className="text-lg font-normal text-blue-200">(25.5°C)</span></h4>
                <p className="text-blue-100">Partly Cloudy</p>
              </div>
              <Sun size={48} className="text-yellow-300 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <Wind size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">8 mph</span>
              </div>
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <Droplets size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">62%</span>
              </div>
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <CloudRain size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">0.0 in</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className={`${alert.bg} border border-stone-200 dark:border-stone-800 p-4 rounded-xl`}>
                <div className="flex items-center gap-2 mb-2">
                  <alert.icon size={18} className={alert.color} />
                  <span className={`font-bold text-sm ${alert.color}`}>{alert.type} • Risk {alert.risk}</span>
                </div>
                <p className="text-sm text-stone-700 dark:text-stone-300 leading-relaxed">
                  {alert.message}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

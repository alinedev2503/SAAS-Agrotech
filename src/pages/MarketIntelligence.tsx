import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Globe, CloudRain, Sun, Wind, Droplets, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function MarketIntelligence() {
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const commodities = [
    { 
      name: language === 'es' ? 'Novillo en Pie (CME)' : language === 'pt' ? 'Boi Gordo (B3/CME)' : 'Live Cattle (CME)', 
      price: '$188.40', 
      unit: language === 'pt' ? '@' : 'cwt', 
      variation: '+1.2%', 
      trend: 'up' 
    },
    { 
      name: language === 'es' ? 'Soja (CBOT)' : language === 'pt' ? 'Soja Grão (CBOT)' : 'Soybeans (CBOT)', 
      price: '$11.65', 
      unit: language === 'pt' ? 'sc' : 'bu', 
      variation: '-0.5%', 
      trend: 'down' 
    },
    { 
      name: language === 'es' ? 'Maíz (CBOT)' : language === 'pt' ? 'Milho (CBOT)' : 'Corn (CBOT)', 
      price: '$4.42', 
      unit: language === 'pt' ? 'sc' : 'bu', 
      variation: '+0.4%', 
      trend: 'up' 
    },
    { 
      name: language === 'es' ? 'Trigo (CBOT)' : language === 'pt' ? 'Trigo (CBOT)' : 'Wheat (CBOT)', 
      price: '$5.78', 
      unit: language === 'pt' ? 'sc' : 'bu', 
      variation: '+1.8%', 
      trend: 'up' 
    },
  ];

  const news = [
    { 
      id: 1, 
      source: 'USDA FAS', 
      title: language === 'es' 
        ? 'La demanda de exportación de carne vacuna aumenta con fuerza en mercados asiáticos; los precios de contado suben'
        : language === 'pt'
        ? 'Demanda por exportação de carne bovina sobe forte na Ásia; cotações no mercado spot disparam'
        : 'US Beef Export Demand Surges Across Asian Markets; Spot Prices Rally', 
      tag: language === 'es' ? 'Comercio' : language === 'pt' ? 'Comércio' : 'Trade',
      time: language === 'es' ? 'Hace 2h' : language === 'pt' ? 'Há 2h' : '2h ago'
    },
    { 
      id: 2, 
      source: 'Farm Futures', 
      title: language === 'es'
        ? 'Mantenimiento del corredor ferroviario programado; acopios y terminales deben ajustar logística de carga'
        : language === 'pt'
        ? 'Manutenção no corredor ferroviário programada; armazéns devem calibrar fretes e escoamento'
        : 'Midwest Rail Corridor Maintenance Scheduled; Grain Elevators Advised to Adjust Logistics', 
      tag: language === 'es' ? 'Logística' : language === 'pt' ? 'Logística' : 'Logistics',
      alert: true,
      time: language === 'es' ? 'Hace 35m' : language === 'pt' ? 'Há 35m' : '35m ago'
    },
    { 
      id: 3, 
      source: 'AgWeb Markets', 
      title: language === 'es'
        ? 'Los precios de fertilizantes e insumos se normalizan para la siembra de primavera'
        : language === 'pt'
        ? 'Cotações de fertilizantes e adubos estabilizam antes da janela de semeadura'
        : 'Fertilizer Input Pricing Normalizes for Spring Planting Across Central Plains', 
      tag: language === 'es' ? 'Insumos' : language === 'pt' ? 'Insumos' : 'Inputs',
      time: language === 'es' ? 'Hace 4h' : language === 'pt' ? 'Há 4h' : '4h ago'
    },
  ];

  const weatherAlerts = [
    {
      id: 1,
      type: language === 'es' ? 'Alerta de Riesgo de Helada' : language === 'pt' ? 'Alerta de Risco de Geada' : 'Frost Risk Alert',
      risk: language === 'es' ? 'Alto' : language === 'pt' ? 'Alto' : 'High',
      message: language === 'es'
        ? 'Temperaturas nocturnas cercanas a -1°C previstas en el Lote 4. Se recomienda calibrar riego antihelada y proteger brotes tiernos.'
        : language === 'pt'
        ? 'Previsão de temperatura em torno de -1°C na madrugada no Talhão 4. Recomenda-se acionar irrigação anti-geada e verificar mudas.'
        : 'Sub-freezing ground temperatures forecast Tuesday dawn (30°F / -1°C). Check frost-sensitive crops and calibrate irrigation.',
      icon: CloudRain,
      color: 'text-blue-500 dark:text-blue-400',
      bg: 'bg-blue-50 dark:bg-blue-950/30'
    },
    {
      id: 2,
      type: language === 'es' ? 'Déficit de Humedad del Suelo' : language === 'pt' ? 'Déficit Hídrico no Solo' : 'Soil Moisture Deficit',
      risk: language === 'es' ? 'Moderado' : language === 'pt' ? 'Moderado' : 'Moderate',
      message: language === 'es'
        ? 'Déficit hídrico acumulado de 15 mm en el estrato superficial. Se aconseja suplementar con el pivote central de riego.'
        : language === 'pt'
        ? 'Déficit hídrico acumulado de 15 mm no solo superficial. Aconselha-se suplementação com pivô central.'
        : 'Cumulative moisture deficit of 0.6 in detected in topsoil layer. Supplemental center-pivot irrigation recommended.',
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
        <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.mkt_title}</h2>
        <p className="text-stone-500 dark:text-stone-400">{t.mkt_subtitle}</p>
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
              {t.mkt_radar_title}
            </h3>
            <span className="text-xs font-bold text-stone-400 uppercase">{t.mkt_radar_sources}</span>
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
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  {language === 'es' ? 'Fuente' : language === 'pt' ? 'Fonte' : 'Source'}: {item.source}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Climate Intelligence */}
        <section className="space-y-4">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <CloudRain className="text-blue-500" size={20} />
            {t.mkt_weather_ai}
          </h3>

          <div className="bg-gradient-to-br from-blue-600 to-cyan-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-blue-100 text-sm font-medium">
                  {language === 'es' ? 'Estación Meteorológica Campo #04' : language === 'pt' ? 'Estação Meteorológica Campo #04' : 'Heartland Field Station #04'}
                </p>
                <h4 className="text-3xl font-bold">25.5°C <span className="text-lg font-normal text-blue-200">(78°F)</span></h4>
                <p className="text-blue-100">
                  {language === 'es' ? 'Parcialmente Nublado' : language === 'pt' ? 'Parcialmente Nublado' : 'Partly Cloudy'}
                </p>
              </div>
              <Sun size={48} className="text-yellow-300 animate-pulse" />
            </div>
            
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <Wind size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">{t.mkt_wind}: 13 km/h</span>
              </div>
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <Droplets size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">{t.mkt_humidity}: 62%</span>
              </div>
              <div className="bg-white/20 rounded-lg p-2 backdrop-blur-sm">
                <CloudRain size={16} className="mx-auto mb-1" />
                <span className="text-xs font-bold">{t.mkt_rain}: 0.0 mm</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {weatherAlerts.map((alert) => (
              <div key={alert.id} className={`${alert.bg} border border-stone-200 dark:border-stone-800 p-4 rounded-xl`}>
                <div className="flex items-center gap-2 mb-2">
                  <alert.icon size={18} className={alert.color} />
                  <span className={`font-bold text-sm ${alert.color}`}>
                    {alert.type} • {language === 'es' ? 'Riesgo' : language === 'pt' ? 'Risco' : 'Risk'} {alert.risk}
                  </span>
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

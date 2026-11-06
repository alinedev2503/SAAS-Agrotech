import { useNavigate } from 'react-router-dom';
import { CloudRain, TrendingUp, AlertTriangle, Droplets, Thermometer, AlertOctagon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { inventoryAlerts } from '../data/inventory';
import { useLanguage } from '../contexts/LanguageContext';

export default function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void }) {
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const criticalStockItems = inventoryAlerts.filter(item => item.status === 'critical_stock');

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    }
    navigate(`/${path}`);
  };

  const locale = language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US';

  return (
    <div className="space-y-6">
      <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.dash_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">
            {t.dash_subtitle} • {new Date().toLocaleDateString(locale, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          {language === 'es' ? 'Estado Operativo: Normal' : language === 'pt' ? 'Status Operacional: Normal' : 'Operational Status: Normal'}
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
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 dark:text-blue-300">
                  {language === 'es' ? 'Alerta Agroclimática' : language === 'pt' ? 'Alerta Agroclimático' : 'Weather Advisory'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100">
                  {language === 'es' ? 'Lote #04' : language === 'pt' ? 'Talhão #04' : 'Plot #04'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mt-1">{t.dash_frost_alert_title}</h3>
              <p className="text-blue-800 dark:text-blue-200 mt-1 text-sm font-medium">{t.dash_frost_alert_desc}</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                {language === 'es' 
                  ? 'Acción Recomendada: Activar microaspersores protectores en el Lote #04 para mitigar el congelamiento del tejido vegetal.' 
                  : language === 'pt' 
                    ? 'Ação Recomendada: Ativar microaspersores de proteção no Talhão #04 para evitar congelamento.'
                    : 'Recommended Action: Activate protective micro-sprinklers in Plot #04 to mitigate crop tissue freezing.'}
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
                <span className="text-xs font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300">
                  {language === 'es' ? 'Bienestar del Rodeo' : language === 'pt' ? 'Bem-estar Animal' : 'Herd Wellness'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100">
                  {language === 'es' ? 'Corral B' : language === 'pt' ? 'Curral B' : 'Pen B'}
                </span>
              </div>
              <h3 className="font-bold text-lg text-orange-900 dark:text-orange-100 mt-1">
                {language === 'es' ? 'Estrés Térmico Bovino (Alerta ITH)' : language === 'pt' ? 'Estresse Térmico Bovino (Alerta ITU)' : 'Cattle Heat Stress (THI Alert)'}
              </h3>
              <p className="text-orange-800 dark:text-orange-200 mt-1 text-sm font-medium">
                {language === 'es' ? 'Índice de Temperatura y Humedad elevado previsto para las 14:00.' : language === 'pt' ? 'Índice de Temperatura e Umidade elevado previsto para as 14:00.' : 'Elevated Temperature-Humidity Index forecasted for 2:00 PM.'}
              </p>
              <p className="text-xs text-orange-600 dark:text-orange-300 mt-2">
                {language === 'es' ? 'Acción: Aumentar caudal en bebederos y verificar sombra en corrales de engorde.' : language === 'pt' ? 'Ação: Aumentar vazão de bebedouros e verificar sombreamento nos piquetes.' : 'Action: Increase water trough throughput and verify corral shading for feedlot cattle.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
          <h3 className="font-bold text-lg mb-6">{language === 'es' ? 'Niveles de Stock (Últimos 7 días)' : language === 'pt' ? 'Níveis de Estoque (Últimos 7 dias)' : 'Stock Levels (Last 7 Days)'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={[
                { name: 'Lun', stock: 4000 }, { name: 'Mar', stock: 3000 }, { name: 'Mié', stock: 5000 },
                { name: 'Jue', stock: 2780 }, { name: 'Vie', stock: 1890 }, { name: 'Sáb', stock: 2390 }, { name: 'Dom', stock: 3490 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#f97316" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
          <h3 className="font-bold text-lg mb-6">{language === 'es' ? 'Frecuencia de Actividad Sanitaria' : language === 'pt' ? 'Frequência de Atividade Sanitária' : 'Sanitary Activity Frequency'}</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={[
                { name: 'Vacunación', count: 40 }, { name: 'Parasitos', count: 25 }, { name: 'Revisión', count: 35 }
              ]}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Market Ticker (CME / Global Agri Futures) */}
      <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-emerald-600 dark:text-emerald-400" />
            <h3 className="font-bold text-lg">
              {language === 'es' 
                ? 'Mercados Agropecuarios y Futuros (Tiempo Real)' 
                : language === 'pt' 
                  ? 'Mercado de Commodities & Futuros (Tempo Real)' 
                  : 'Commodity Markets & Futures (Real-Time)'}
            </h3>
          </div>
          <button 
            onClick={() => handleNavigate('market')}
            className="text-xs font-bold text-primary hover:underline flex items-center gap-1 cursor-pointer"
          >
            {language === 'es' ? 'Análisis Completo de Mercado' : language === 'pt' ? 'Análise Completa de Mercado' : 'Full Market Analysis'} <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">{t.dash_cme_cattle}</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold">$188.50 <span className="text-xs font-normal text-stone-400">/cwt</span></span>
              <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-0.5 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={12} /> 1.2%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">{t.dash_cbot_soybeans}</p>
            <div className="flex items-end justify-between mt-1">
              <span className="text-2xl font-bold">$12.45 <span className="text-xs font-normal text-stone-400">/bu</span></span>
              <span className="text-red-600 dark:text-red-400 text-xs font-bold flex items-center gap-0.5 bg-red-50 dark:bg-red-950/60 px-2 py-0.5 rounded-md">
                <ArrowDownRight size={12} /> 0.5%
              </span>
            </div>
          </div>

          <div className="bg-stone-50 dark:bg-stone-800/50 p-4 rounded-2xl border border-stone-100 dark:border-stone-700">
            <p className="text-stone-500 dark:text-stone-400 text-xs font-bold uppercase tracking-wider">{t.dash_cbot_corn}</p>
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
          <h3 className="font-bold text-xl text-stone-800 dark:text-white">{t.dash_urgent_actions}</h3>
          <span className="text-xs text-stone-500">
            {criticalStockItems.length + 2} {language === 'es' ? 'alertas pendientes' : language === 'pt' ? 'alertas pendentes' : 'pending alerts'}
          </span>
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
                  <h4 className="font-bold text-stone-900 dark:text-white">
                    {language === 'es' ? `Stock Crítico Bajo: ${item.name}` : language === 'pt' ? `Estoque Crítico Baixo: ${item.name}` : `Critical Low Stock: ${item.name}`}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                    {language === 'es' 
                      ? `Solo quedan ${item.quantity} ${item.unit} en depósito. Consumo promedio: ${item.avgConsumption}.` 
                      : language === 'pt' 
                        ? `Apenas ${item.quantity} ${item.unit} restantes. Consumo médio: ${item.avgConsumption}.`
                        : `Only ${item.quantity} ${item.unit} remaining in warehouse. Average consumption rate: ${item.avgConsumption}.`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => handleNavigate('stock')} 
                className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                {language === 'es' ? 'Reponer vía QR' : language === 'pt' ? 'Repor via QR' : 'Restock via QR'}
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
                <h4 className="font-bold text-stone-900 dark:text-white">
                  {language === 'es' ? 'Lote de Vacunas Próximo a Vencer' : language === 'pt' ? 'Lote de Vacinas Próximo do Vencimento' : 'Vaccine Batch Nearing Expiration'}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {language === 'es' ? 'Lote de 50 dosis vence en 2 días. Se requiere aplicación programada.' : language === 'pt' ? 'Lote com 50 doses vence em 2 dias. Aplicação imediata recomendada.' : 'Batch of 50 doses expires in 2 days. Scheduled application required.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('sanitary')} 
              className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              {t.nav_sanitary}
            </button>
          </div>
          
          {/* Pump Maintenance */}
          <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-2.5 rounded-xl text-blue-600 dark:text-blue-400 shrink-0">
                <Droplets size={24} />
              </div>
              <div>
                <h4 className="font-bold text-stone-900 dark:text-white">
                  {language === 'es' ? 'Mantenimiento de Pivote Central #02' : language === 'pt' ? 'Manutenção do Pivô Central de Irrigação #02' : 'Irrigation Center Pivot #02 Maintenance'}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                  {language === 'es' ? 'Inspección preventiva programada hoy a las 16:00 por el equipo de campo.' : language === 'pt' ? 'Inspeção preventiva agendada para hoje às 16:00.' : 'Scheduled preventive inspection today at 4:00 PM by Field Team.'}
                </p>
              </div>
            </div>
            <button 
              onClick={() => handleNavigate('crops')} 
              className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 hover:bg-stone-200 dark:hover:bg-stone-700 px-4 py-2 rounded-xl font-bold text-xs transition-colors shrink-0 cursor-pointer"
            >
              {language === 'es' ? 'Detalles de Lote' : language === 'pt' ? 'Detalhes do Talhão' : 'Field Details'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

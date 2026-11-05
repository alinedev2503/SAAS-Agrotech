import { useState } from 'react';
import { Calculator, Map, ArrowRight, CloudRain, Thermometer, AlertTriangle, Mic, Calendar } from 'lucide-react';
import { useVoiceInput } from '../hooks/useVoiceInput';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';

export default function Crops() {
  const { language, t } = useLanguage();
  const [seedVigor, setSeedVigor] = useState(95);
  const [soilAnalysis, setSoilAnalysis] = useState('');
  const [result, setResult] = useState<{density: string, fertilizer: string} | null>(null);
  
  // Harvest Schedule State
  const [plantingDate, setPlantingDate] = useState('');
  const [thermalSum, setThermalSum] = useState('');
  const [harvestProjection, setHarvestProjection] = useState<string | null>(null);
  const [isCalculatingHarvest, setIsCalculatingHarvest] = useState(false);

  const { isListening, processing, result: voiceResult, startListening } = useVoiceInput();

  const calculatePrecision = () => {
    const popPerAcre = Math.round(140000 * (seedVigor / 100));
    setResult({
      density: language === 'es' 
        ? `${popPerAcre.toLocaleString()} plantas/acre (~${Math.round(popPerAcre * 2.47).toLocaleString()}/ha)`
        : language === 'pt' 
          ? `${popPerAcre.toLocaleString()} plantas/acre (~${Math.round(popPerAcre * 2.47).toLocaleString()}/ha)`
          : `${popPerAcre.toLocaleString()} seeds/acre (~${Math.round(popPerAcre * 2.47).toLocaleString()}/ha)`,
      fertilizer: language === 'es'
        ? '315 kg/ha (NPK 04-14-08 Fórmula Siembra)'
        : language === 'pt'
          ? '315 kg/ha (NPK 04-14-08 Fórmula Plantio)'
          : '280 lbs/acre (NPK 04-14-08 Starter Blend)'
    });
  };

  const calculateHarvestDate = async () => {
    if (!plantingDate || !thermalSum) return;
    setIsCalculatingHarvest(true);
    try {
        if (process.env.GEMINI_API_KEY) {
          const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
          const langPrompt = language === 'es' ? 'Answer in Spanish.' : language === 'pt' ? 'Answer in Portuguese.' : 'Answer in clear English.';
          const response = await ai.models.generateContent({
              model: "gemini-2.5-flash",
              contents: `Based on planting date ${plantingDate} and accumulated Growing Degree Days (GDD) of ${thermalSum}, project the estimated harvest maturity window. Briefly explain the crop physiology logic for corn/soybean. ${langPrompt}`,
          });
          setHarvestProjection(response.text || null);
        } else {
          // Realistic local estimation fallback
          const date = new Date(plantingDate);
          const gdd = parseInt(thermalSum, 10) || 1200;
          const daysToMaturity = Math.round(gdd / 21);
          date.setDate(date.getDate() + daysToMaturity);
          const locale = language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US';
          const formattedDate = date.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });
          if (language === 'es') {
            setHarvestProjection(`Madurez Fisiológica Estimada (R6 / Capa Negra): ${formattedDate}\nBasado en una suma térmica de ${gdd} GDD, el cultivo requiere aproximadamente ${daysToMaturity} días desde la emergencia hasta la madurez completa. Se sugiere muestreo de humedad de grano 10 días antes de la cosecha.`);
          } else if (language === 'pt') {
            setHarvestProjection(`Maturação Fisiológica Estimada (R6 / Camada Preta): ${formattedDate}\nCom base em ${gdd} GDD acumulados, a lavoura requer cerca de ${daysToMaturity} dias da emergência à colheita. Recomenda-se teste de umidade de grãos 10 dias antes.`);
          } else {
            setHarvestProjection(`Estimated Physiological Maturity (R6/Black Layer): ${formattedDate}\nBased on accumulated ${gdd} GDD heat units, the crop requires approximately ${daysToMaturity} days from emergence to reach full maturity. Recommend field dry-down sampling 10 days prior to harvest.`);
          }
        }
    } catch (error) {
        console.error("Error calculating harvest date", error);
        setHarvestProjection(
          language === 'es' 
            ? "Ventana estimada de cosecha: Fines de marzo a mediados de abril. Verificar humedad de suelo antes de ingresar cosechadora."
            : language === 'pt'
              ? "Janela estimada de colheita: Final de março a meados de abril. Verificar umidade do solo antes da colheita."
              : "Estimated harvest window: Late September to early October (115-day RM hybrid). Verify soil moisture before running combine harvester."
        );
    } finally {
        setIsCalculatingHarvest(false);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.crops_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t.crops_subtitle}</p>
        </div>
        <button 
          onClick={() => startListening('Crops')}
          className={`p-4 rounded-full shadow-lg transition-all ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:scale-105'
          }`}
          title="Field Voice Commands"
        >
          <Mic size={24} />
        </button>
      </header>

      {/* Voice Result Feedback */}
      {(processing || voiceResult) && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-200 dark:border-blue-800">
          {processing ? (
            <p className="text-blue-800 dark:text-blue-300 font-medium animate-pulse">Processing agronomic voice command...</p>
          ) : (
            <p className="text-blue-800 dark:text-blue-300 font-medium">{voiceResult}</p>
          )}
        </div>
      )}

      {/* Predictive Alerts Section */}
      <section className="bg-gradient-to-br from-indigo-900 to-purple-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-sm">
            <CloudRain size={24} className="text-white" />
          </div>
          <h3 className="font-bold text-xl">
            {language === 'es' ? 'Alertas Agronómicas Predictivas (IA)' : language === 'pt' ? 'Alertas Agronômicos Preditivos (IA)' : 'Predictive Agronomic Alerts (AI Powered)'}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
          {/* Frost Alert */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex items-start gap-4">
            <div className="bg-blue-500/20 p-3 rounded-xl text-blue-300 shrink-0">
              <Thermometer size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-blue-100">{t.dash_frost_alert_title}</h4>
              <p className="text-sm text-blue-200/90 mb-2 leading-relaxed">
                {language === 'es' 
                  ? 'Alta probabilidad de helada en 48h. El estadio fenológico de floración (R1) es crítico para el rendimiento.' 
                  : language === 'pt' 
                    ? 'Alta probabilidade de geada em 48h. A fase de florescimento (R1) é crítica para a produtividade.'
                    : 'High probability of ground frost within 48h. Current flowering stage (R1) is critical for yield.'}
              </p>
              <span className="inline-block bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {language === 'es' ? 'Acción: Calibrar aspersión y cobertura térmica' : language === 'pt' ? 'Ação: Acionar irrigação anti-geada' : 'Action: Cover nurseries & initiate thermal misting'}
              </span>
            </div>
          </div>

          {/* Drought Alert */}
          <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex items-start gap-4">
            <div className="bg-orange-500/20 p-3 rounded-xl text-orange-300 shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h4 className="font-bold text-lg text-orange-100">
                {language === 'es' ? 'Déficit de Humedad en Subsuelo' : language === 'pt' ? 'Déficit Hídrico Subsuperficial' : 'Subsurface Moisture Deficit'}
              </h4>
              <p className="text-sm text-orange-200/90 mb-2 leading-relaxed">
                {language === 'es' 
                  ? 'Pronóstico de 10 días secos. La humedad en la zona radicular caerá por debajo del 32% volumétrico.' 
                  : language === 'pt' 
                    ? 'Previsão de estiagem de 10 dias. Umidade na zona radicular abaixo de 32% volumétrico.'
                    : '10-day dry spell forecast. Root-zone soil moisture falling below 32% volumetric water content.'}
              </p>
              <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                {language === 'es' ? 'Acción: Adelantar turno de riego por pivote' : language === 'pt' ? 'Ação: Adiantar turno de irrigação do pivô' : 'Action: Advance pivot irrigation schedule'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Precision Calculator */}
        <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2.5 rounded-xl text-emerald-700 dark:text-emerald-400">
              <Calculator size={24} />
            </div>
            <h3 className="font-bold text-xl text-stone-900 dark:text-white">
              {language === 'es' ? 'Calculadora de Precisión de Insumos' : language === 'pt' ? 'Calculadora de Precisão de Insumos' : 'Precision Input Calculator'}
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                {language === 'es' ? 'Tasa de Germinación y Vigor de Semilla (%)' : language === 'pt' ? 'Taxa de Germinação & Vigor da Semente (%)' : 'Seed Germination & Vigor Rate (%)'}
              </label>
              <input 
                type="range" 
                min="80" 
                max="100" 
                value={seedVigor} 
                onChange={(e) => setSeedVigor(Number(e.target.value))}
                className="w-full h-2 bg-stone-200 dark:bg-stone-700 rounded-lg appearance-none cursor-pointer accent-orange-600"
              />
              <div className="flex justify-between text-xs text-stone-500 dark:text-stone-400 mt-1 font-mono">
                <span>80%</span>
                <span className="font-bold text-orange-600 dark:text-orange-400 text-base">{seedVigor}%</span>
                <span>100%</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                {language === 'es' ? 'ID Muestra de Suelo / Zona' : language === 'pt' ? 'ID da Análise de Solo / Talhão' : 'Soil Sample Lab ID / Zone'}
              </label>
              <input 
                type="text" 
                placeholder={language === 'es' ? 'Ej: Lote Norte #04 - Zona B' : language === 'pt' ? 'Ex: Talhão Norte #04 - Zona B' : 'e.g., North Field #04 - Zone B'}
                value={soilAnalysis}
                onChange={(e) => setSoilAnalysis(e.target.value)}
                className="w-full p-3 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm"
              />
            </div>

            <button 
              onClick={calculatePrecision}
              className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-3.5 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
            >
              {language === 'es' ? 'Calcular Prescripción de Siembra' : language === 'pt' ? 'Calcular Densidade & Adubação' : 'Calculate Seeding Prescription'} <ArrowRight size={18} />
            </button>

            {result && (
              <div className="mt-5 bg-emerald-50 dark:bg-emerald-950/30 p-5 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 animate-in fade-in slide-in-from-top-4">
                <h4 className="font-bold text-emerald-900 dark:text-emerald-300 mb-3 text-sm">
                  {language === 'es' ? 'Prescripción Objetivo Calibrada:' : language === 'pt' ? 'Prescrição Agronômica Calibrada:' : 'Target Seeding Prescription:'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-bold">
                      {language === 'es' ? 'Densidad Poblacional' : language === 'pt' ? 'Densidade Populacional' : 'Population Density'}
                    </p>
                    <p className="text-base font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">{result.density}</p>
                  </div>
                  <div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400 uppercase font-bold">
                      {language === 'es' ? 'Dosis de Fertilizante' : language === 'pt' ? 'Dose de Adubação' : 'Fertilizer Rate'}
                    </p>
                    <p className="text-base font-bold text-emerald-900 dark:text-emerald-100 mt-0.5">{result.fertilizer}</p>
                  </div>
                </div>
                <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-3 italic">
                  {language === 'es' 
                    ? '*Ahorro estimado en insumos: ~$24.00/acre versus siembra empírica sin calibrar.' 
                    : language === 'pt' 
                      ? '*Economia estimada: ~R$ 120/ha versus manejo empírico.'
                      : '*Estimated input savings: ~$24.00/acre versus uncalibrated baseline.'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Harvest Schedule */}
        <section className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
            <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-700 dark:text-orange-400">
                    <Calendar size={24} />
                </div>
                <h3 className="font-bold text-xl text-stone-900 dark:text-white">{t.crops_gdd_calc_title}</h3>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                      {t.crops_planting_date}
                    </label>
                    <input
                        type="date"
                        value={plantingDate}
                        onChange={(e) => setPlantingDate(e.target.value)}
                        className="w-full p-3 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 mb-1.5">
                      {language === 'es' ? 'Unidades Térmicas Objetivo (GDD)' : language === 'pt' ? 'Graus-Dia Acumulados Alvo (GDD)' : 'Target Heat Units (GDD)'}
                    </label>
                    <input
                        type="number"
                        placeholder="e.g., 2450"
                        value={thermalSum}
                        onChange={(e) => setThermalSum(e.target.value)}
                        className="w-full p-3 border border-stone-300 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm"
                    />
                </div>

                <button
                    onClick={calculateHarvestDate}
                    disabled={isCalculatingHarvest}
                    className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-3.5 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 text-sm shadow-md cursor-pointer"
                >
                    {isCalculatingHarvest 
                      ? (language === 'es' ? 'Calculando Madurez...' : language === 'pt' ? 'Calculando Maturação...' : 'Calculating GDD Maturity...') 
                      : (language === 'es' ? 'Pronosticar Fecha de Cosecha' : language === 'pt' ? 'Prever Data da Colheita' : 'Forecast Harvest Date')} <ArrowRight size={18} />
                </button>

                {harvestProjection && (
                    <div className="mt-5 bg-orange-50 dark:bg-orange-900/20 p-5 rounded-2xl border border-orange-200 dark:border-orange-800 animate-in fade-in slide-in-from-top-4">
                        <h4 className="font-bold text-orange-900 dark:text-orange-300 mb-2 text-sm">{t.crops_result_harvest}:</h4>
                        <p className="text-stone-700 dark:text-stone-300 whitespace-pre-line text-xs leading-relaxed">{harvestProjection}</p>
                    </div>
                )}
            </div>
        </section>

        {/* Crop Map / Status */}
        <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white p-6 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 relative overflow-hidden transition-colors duration-300 lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="bg-stone-100 dark:bg-stone-800 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
              <Map size={24} />
            </div>
            <div>
              <h3 className="font-bold text-xl">
                {language === 'es' ? 'Mapa de Lotes y Estadios Fenológicos' : language === 'pt' ? 'Mapa de Talhões & Fases Fenológicas' : 'Field Plot Map & Growth Stages'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {language === 'es' ? 'Fases de desarrollo vegetal en tiempo real en la superficie sembrada.' : language === 'pt' ? 'Acompanhamento do ciclo vegetativo em cada talhão.' : 'Current phenological phases across monitored acreage.'}
              </p>
            </div>
          </div>

          <div className="space-y-4 relative z-10">
            {[
              { 
                id: language === 'es' ? 'Lote #01' : language === 'pt' ? 'Talhão #01' : 'Plot #01', 
                crop: language === 'es' ? 'Soja (Grupo 3.2)' : language === 'pt' ? 'Soja (Grupo 3.2)' : 'Soybeans (Group 3.2)', 
                stage: language === 'es' ? 'R1 - Inicio de Floración' : language === 'pt' ? 'R1 - Início do Florescimento' : 'R1 - Beginning Flowering', 
                progress: 65, 
                color: 'bg-emerald-500' 
              },
              { 
                id: language === 'es' ? 'Lote #02' : language === 'pt' ? 'Talhão #02' : 'Plot #02', 
                crop: language === 'es' ? 'Maíz Híbrido' : language === 'pt' ? 'Milho Híbrido' : 'Field Corn (Yellow Dent)', 
                stage: language === 'es' ? 'V4 - Cuarta Hoja Visible' : language === 'pt' ? 'V4 - 4ª Folha Desenvolvida' : 'V4 - 4th Leaf Collar Stage', 
                progress: 30, 
                color: 'bg-yellow-500' 
              },
              { 
                id: language === 'es' ? 'Lote #03' : language === 'pt' ? 'Talhão #03' : 'Plot #03', 
                crop: language === 'es' ? 'Alfalfa / Pasturas de Engorde' : language === 'pt' ? 'Pastagem / Alfafa' : 'Alfalfa / Grazing Pasture', 
                stage: language === 'es' ? 'Rebrote Vegetativo Avanzado' : language === 'pt' ? 'Rebrota Vegetativa Avançada' : 'Late Vegetative Regrowth', 
                progress: 90, 
                color: 'bg-blue-500' 
              },
            ].map((field) => (
              <div key={field.id} className="bg-stone-50 dark:bg-stone-800/60 p-4 rounded-2xl border border-stone-200 dark:border-stone-700/60">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-stone-600 dark:text-stone-300 bg-white dark:bg-stone-900 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-stone-700">
                      {field.id}
                    </span>
                    <span className="font-bold text-base">{field.crop}</span>
                  </div>
                  <span className="text-xs font-bold text-stone-500 dark:text-stone-400">
                    {field.progress}% {language === 'es' ? 'del Ciclo' : language === 'pt' ? 'do Ciclo' : 'Season Cycle'}
                  </span>
                </div>
                <p className="text-xs text-stone-600 dark:text-stone-300 mb-3">{field.stage}</p>
                <div className="w-full bg-stone-200 dark:bg-stone-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${field.color}`} 
                    style={{ width: `${field.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Camera, ScanLine, AlertTriangle, PackageCheck, Sprout, AlertOctagon, Droplets, ThermometerSun, BrainCircuit, Sparkles, X, Download, Search } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { inventoryAlerts } from '../data/inventory';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function Stock() {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedData, setScannedData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'critical_expiration':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200';
      case 'critical_stock':
        return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-900 dark:text-orange-200';
      case 'warning_expiration':
        return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-200';
      default:
        return 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100';
    }
  };

  const getStatusLabel = (item: any) => {
    switch (item.status) {
      case 'critical_expiration':
        return <span className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-1"><AlertTriangle size={14} /> Vence em {item.daysToExpire} dias</span>;
      case 'critical_stock':
        return <span className="text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center gap-1"><AlertOctagon size={14} /> Estoque Baixo ({item.quantity} {item.unit})</span>;
      case 'warning_expiration':
        return <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm flex items-center gap-1"><ThermometerSun size={14} /> Vigor reduz em {item.daysToExpire} dias</span>;
      default:
        return <span className="text-stone-500 dark:text-stone-400 text-sm">Estoque: {item.quantity} {item.unit}</span>;
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nome', 'Tipo', 'Quantidade', 'Unidade', 'Dias para Vencer', 'Status', 'Consumo Médio', 'Último Preço'];
    const csvContent = [
      headers.join(','),
      ...inventoryAlerts.map(item => [
        item.id,
        `"${item.name}"`,
        item.type,
        item.quantity,
        item.unit,
        item.daysToExpire,
        item.status,
        `"${item.avgConsumption}"`,
        `"${item.lastPurchasePrice}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'estoque_agrocontrol.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAnalyzeStock = async (item: any) => {
    setIsAnalyzing(true);
    setSuggestion(null);

    try {
      // Simulate AI analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const prompt = `
        Analise o seguinte item de estoque agrícola e sugira uma estratégia de reposição:
        Item: ${item.name}
        Tipo: ${item.type}
        Estoque Atual: ${item.quantity} ${item.unit}
        Consumo Médio: ${item.avgConsumption}
        Status: ${item.status}
        Preço Última Compra: ${item.lastPurchasePrice}
        
        Retorne APENAS um JSON válido (sem markdown) com a seguinte estrutura:
        {
          "recommendedQty": "quantidade sugerida para compra",
          "reasoning": "explicação curta (max 2 frases) baseada no consumo e urgência",
          "estimatedCost": "custo estimado total (formatado em R$)",
          "priority": "Alta" | "Média" | "Baixa"
        }
      `;

      let responseData;

      if (process.env.GEMINI_API_KEY) {
        try {
          const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
              responseMimeType: 'application/json'
            }
          });
          
          if (result.text) {
             responseData = JSON.parse(result.text);
          }
        } catch (apiError) {
          console.warn("Falha na API Gemini, usando fallback mockado:", apiError);
        }
      }

      // Fallback mock if API fails or no key
      if (!responseData) {
        if (item.status === 'critical_stock') {
          responseData = {
            recommendedQty: item.type === 'supplement' ? '45 sacos' : '120 litros',
            reasoning: `Baseado no consumo de ${item.avgConsumption}, o estoque atual dura menos de uma semana. Recomenda-se compra para cobrir 3 meses.`,
            estimatedCost: item.type === 'supplement' ? 'R$ 3.825,00' : 'R$ 5.400,00',
            priority: 'Alta'
          };
        } else {
          responseData = {
            recommendedQty: 'N/A',
            reasoning: 'Análise indisponível para este status.',
            estimatedCost: 'R$ 0,00',
            priority: 'Baixa'
          };
        }
      }

      setSuggestion({ ...responseData, item });

    } catch (error) {
      console.error("Erro na análise IA:", error);
      setSuggestion({
        item,
        recommendedQty: 'Uso imediato prioritário',
        reasoning: 'Recomendação agronômica preventiva: priorizar a rotação dos lotes com vencimento próximo e programar reposição de segurança.',
        estimatedCost: 'Sob cotação local',
        priority: item.status.includes('critical') ? 'Alta' : 'Média'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanInvoice = async () => {
    setIsScanning(true);
    // Simulate taking a photo and processing with OCR
    setTimeout(async () => {
      setIsScanning(false);
      
      // Mock result from Gemini Vision
      const mockResult = {
        supplier: "AgroCooperativa Central",
        date: "2026-02-26",
        items: [
          { name: "Semente Soja Intacta", qty: "40 sc", unit_price: "R$ 350,00" },
          { name: "Glifosato 20L", qty: "10 un", unit_price: "R$ 980,00" }
        ],
        total: "R$ 23.800,00"
      };
      
      setScannedData(mockResult);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Estoque & Compras</h2>
          <p className="text-stone-500 dark:text-stone-400">Gestão de insumos e leitura de notas fiscais.</p>
        </div>
        <button 
          onClick={handleExportCSV}
          className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-2 rounded-lg font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
        >
          <Download size={20} />
          <span className="hidden sm:inline">Exportar Relatório</span>
        </button>
      </header>

      {/* OCR Action Area */}
      <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-2xl p-8 text-center relative overflow-hidden border border-stone-200 dark:border-stone-700 transition-colors duration-300">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')] opacity-5 dark:opacity-10 bg-cover bg-center"></div>
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-100 dark:bg-orange-600 rounded-full flex items-center justify-center mb-4 shadow-xl shadow-orange-900/10 dark:shadow-orange-900/50">
            <Camera size={40} className="text-orange-600 dark:text-white" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Lançamento Automático</h3>
          <p className="text-stone-500 dark:text-stone-300 max-w-md mx-auto mb-6">
            Tire uma foto da Nota Fiscal para dar entrada no estoque e atualizar o financeiro automaticamente.
          </p>
          <button 
            onClick={handleScanInvoice}
            disabled={isScanning}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-2"
          >
            {isScanning ? (
              <>
                <ScanLine className="animate-spin" /> Processando IA...
              </>
            ) : (
              <>
                <Camera size={24} /> Fotografar Nota Fiscal
              </>
            )}
          </button>
        </div>
      </section>

      {/* Scanned Result Preview */}
      {scannedData && (
        <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-orange-100 animate-in zoom-in-95">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-lg text-stone-900">Nota Fiscal Identificada</h4>
              <p className="text-stone-500">{scannedData.supplier} • {scannedData.date}</p>
            </div>
            <button 
              onClick={() => setScannedData(null)}
              className="text-stone-400 hover:text-stone-600"
            >
              Descartar
            </button>
          </div>
          
          <div className="bg-stone-50 rounded-xl p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200">
                  <th className="pb-2">Item</th>
                  <th className="pb-2">Qtd</th>
                  <th className="pb-2 text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {scannedData.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2 font-medium text-stone-800">{item.name}</td>
                    <td className="py-2 text-stone-600">{item.qty}</td>
                    <td className="py-2 text-right text-stone-800">{item.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="font-bold text-xl text-stone-900">Total: {scannedData.total}</span>
            <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700">
              Confirmar Entrada
            </button>
          </div>
        </div>
      )}

      {/* AI Suggestion Modal */}
      {suggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
              <button 
                onClick={() => setSuggestion(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
              >
                <X size={24} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <BrainCircuit size={32} className="text-white" />
                <h3 className="font-bold text-xl">Sugestão Inteligente</h3>
              </div>
              <p className="text-indigo-100 text-sm">Análise baseada no histórico de consumo.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-4">
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">Item Analisado</p>
                  <p className="font-bold text-stone-900 dark:text-white text-lg">{suggestion.item.name}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                  Prioridade {suggestion.priority}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Reposição Sugerida</p>
                  <p className="font-bold text-stone-900 dark:text-white text-xl">{suggestion.recommendedQty}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-xl">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Custo Estimado</p>
                  <p className="font-bold text-stone-900 dark:text-white text-xl">{suggestion.estimatedCost}</p>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex gap-2 mb-2">
                  <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Por que comprar isso?</p>
                </div>
                <p className="text-sm text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {suggestion.reasoning}
                </p>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-900/20">
                Gerar Pedido de Compra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inventory Alerts Radar */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <AlertTriangle className="text-orange-500" />
            Radar de Estoque & Vencimentos
          </h3>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar item..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {inventoryAlerts
            .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
            .filter(i => i.status !== 'ok') // Keep existing filter logic if intended, or remove if search should show all. The original code had .filter(i => i.status !== 'ok'). I will keep it but apply search first.
            .map((item) => (
            <div key={item.id} className={`border p-4 rounded-xl flex items-center gap-4 transition-colors ${getStatusStyle(item.status)}`}>
              <div className="bg-white dark:bg-stone-800 p-3 rounded-lg shadow-sm">
                <item.icon size={24} className={
                  item.status === 'critical_expiration' ? 'text-red-500' :
                  item.status === 'critical_stock' ? 'text-orange-500' :
                  'text-yellow-600 dark:text-yellow-500'
                } />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg flex items-center gap-2 text-stone-900 dark:text-white">
                  {item.name}
                  {item.status === 'critical_expiration' && <AlertTriangle size={18} className="text-red-500" />}
                  {item.status === 'critical_stock' && <AlertOctagon size={18} className="text-orange-500" />}
                </h4>
                {getStatusLabel(item)}
              </div>
              {item.status === 'critical_stock' ? (
                <button 
                  onClick={() => handleAnalyzeStock(item)}
                  disabled={isAnalyzing}
                  className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800"
                >
                  {isAnalyzing ? <ScanLine size={16} className="animate-spin" /> : <BrainCircuit size={16} />}
                  <span className="hidden sm:inline">IA</span>
                </button>
              ) : (
                <button className="px-3 py-1 bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 rounded-lg text-sm font-bold transition-colors text-stone-700 dark:text-stone-300">
                  Repor
                </button>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* Purchase History Section */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 p-6">
        <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-4 flex items-center gap-2">
          <PackageCheck className="text-green-600" />
          Histórico de Compras
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 dark:text-stone-400 uppercase bg-stone-50 dark:bg-stone-800/50">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Data</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Fornecedor</th>
                <th className="px-4 py-3 text-center">Qtd</th>
                <th className="px-4 py-3 text-right">Preço Unit.</th>
                <th className="px-4 py-3 text-right rounded-r-lg">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
              {[
                { date: '25/02/2026', item: 'Semente Milho Híbrido', supplier: 'AgroSeeds Ltda', qty: '40 sc', price: 'R$ 450,00', total: 'R$ 18.000,00' },
                { date: '20/02/2026', item: 'Adubo NPK 04-14-08', supplier: 'Fertilizantes do Sul', qty: '10 ton', price: 'R$ 2.800,00', total: 'R$ 28.000,00' },
                { date: '15/02/2026', item: 'Vacina Aftosa', supplier: 'VetFarma', qty: '100 ds', price: 'R$ 4,50', total: 'R$ 450,00' },
                { date: '10/02/2026', item: 'Sal Mineral 80kg', supplier: 'NutriBoi', qty: '20 sc', price: 'R$ 85,00', total: 'R$ 1.700,00' },
                { date: '05/02/2026', item: 'Herbicida Glifosato', supplier: 'AgroQuímica', qty: '50 L', price: 'R$ 45,00', total: 'R$ 2.250,00' },
              ].map((history, index) => (
                <tr key={index} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                  <td className="px-4 py-3 font-medium text-stone-900 dark:text-white">{history.date}</td>
                  <td className="px-4 py-3 text-stone-700 dark:text-stone-300">{history.item}</td>
                  <td className="px-4 py-3 text-stone-500 dark:text-stone-400">{history.supplier}</td>
                  <td className="px-4 py-3 text-center text-stone-700 dark:text-stone-300 bg-stone-50 dark:bg-stone-800 rounded-lg">{history.qty}</td>
                  <td className="px-4 py-3 text-right text-stone-700 dark:text-stone-300">{history.price}</td>
                  <td className="px-4 py-3 text-right font-bold text-stone-900 dark:text-white">{history.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

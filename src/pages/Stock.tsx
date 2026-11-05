import { useState, useEffect } from 'react';
import { 
  Camera, ScanLine, AlertTriangle, PackageCheck, Sprout, 
  AlertOctagon, Droplets, ThermometerSun, BrainCircuit, Sparkles, 
  X, Download, Search, QrCode, ArrowDownRight, ArrowUpRight, 
  History, User, CheckCircle2
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { inventoryAlerts } from '../data/inventory';
import StockQRScannerModal, { InventoryItem, StockMovement } from '../components/StockQRScannerModal';
import ItemQRCodeModal from '../components/ItemQRCodeModal';
import { useLanguage } from '../contexts/LanguageContext';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const STORAGE_ITEMS_KEY = 'agrotech_inventory_items';
const STORAGE_MOVEMENTS_KEY = 'agrotech_inventory_movements';

export default function Stock() {
  const { language, t } = useLanguage();
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_ITEMS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // Fallback
      }
    }
    return inventoryAlerts.map(i => ({
      id: i.id,
      name: i.name,
      type: i.type,
      quantity: i.quantity,
      unit: i.unit,
      daysToExpire: i.daysToExpire,
      status: i.status,
      avgConsumption: i.avgConsumption,
      lastPurchasePrice: i.lastPurchasePrice
    }));
  });

  const [movements, setMovements] = useState<StockMovement[]>(() => {
    const saved = localStorage.getItem(STORAGE_MOVEMENTS_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback
      }
    }
    return [
      {
        id: 'mov-init-1',
        itemId: 1,
        itemName: 'FMD Vaccine (Batch 882)',
        type: 'check_out',
        quantity: 20,
        unit: 'doses',
        previousQty: 60,
        newQty: 40,
        reason: 'Livestock Herd Vaccination - Pen A',
        operator: 'Dr. Robert Mitchell (DVM)',
        destination: 'Chute #01',
        timestamp: 'Nov 4, 2026, 02:30 PM'
      },
      {
        id: 'mov-init-2',
        itemId: 3,
        itemName: 'Cattle Mineral Supplement 50lb',
        type: 'check_in',
        quantity: 15,
        unit: 'bags',
        previousQty: 2,
        newQty: 17,
        reason: 'Supplier Delivery Receipt',
        operator: 'Marcus Hall',
        destination: 'Feed Storage Shed',
        timestamp: 'Nov 3, 2026, 09:15 AM'
      }
    ];
  });

  // Modal and scanning states
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const [selectedQRItem, setSelectedQRItem] = useState<InventoryItem | null>(null);
  const [isScanningInvoice, setIsScanningInvoice] = useState(false);
  const [scannedInvoiceData, setScannedInvoiceData] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterView, setFilterView] = useState<'all' | 'alerts' | 'movements'>('alerts');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MOVEMENTS_KEY, JSON.stringify(movements));
  }, [movements]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'medicine': return AlertTriangle;
      case 'seeds': return Sprout;
      case 'supplement': return AlertOctagon;
      case 'fertilizer': return Droplets;
      case 'chemical': return AlertOctagon;
      default: return PackageCheck;
    }
  };

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

  const getStatusLabel = (item: InventoryItem) => {
    switch (item.status) {
      case 'critical_expiration':
        return (
          <span className="text-red-600 dark:text-red-400 font-bold text-sm flex items-center gap-1">
            <AlertTriangle size={14} /> 
            {language === 'es' ? `Vence en ${item.daysToExpire} días` : language === 'pt' ? `Vence em ${item.daysToExpire} dias` : `Expires in ${item.daysToExpire} days`}
          </span>
        );
      case 'critical_stock':
        return (
          <span className="text-orange-600 dark:text-orange-400 font-bold text-sm flex items-center gap-1">
            <AlertOctagon size={14} /> 
            {language === 'es' ? `Stock Crítico (${item.quantity} ${item.unit})` : language === 'pt' ? `Estoque Baixo (${item.quantity} ${item.unit})` : `Low Inventory (${item.quantity} ${item.unit})`}
          </span>
        );
      case 'warning_expiration':
        return (
          <span className="text-yellow-600 dark:text-yellow-400 font-bold text-sm flex items-center gap-1">
            <ThermometerSun size={14} /> 
            {language === 'es' ? `Vigor decrece en ${item.daysToExpire} días` : language === 'pt' ? `Vigor reduz em ${item.daysToExpire} dias` : `Vigor drops in ${item.daysToExpire} days`}
          </span>
        );
      default:
        return (
          <span className="text-stone-500 dark:text-stone-400 text-sm">
            {language === 'es' ? `En Stock: ${item.quantity} ${item.unit}` : language === 'pt' ? `Em Estoque: ${item.quantity} ${item.unit}` : `In Stock: ${item.quantity} ${item.unit}`}
          </span>
        );
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Item Name', 'Category', 'Quantity', 'Unit', 'Days to Expire', 'Status', 'Avg Consumption', 'Last Purchase Price'];
    const csvContent = [
      headers.join(','),
      ...items.map(item => [
        item.id,
        `"${item.name}"`,
        item.type,
        item.quantity,
        item.unit,
        item.daysToExpire,
        item.status,
        `"${item.avgConsumption || ''}"`,
        `"${item.lastPurchasePrice || ''}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'agrotech_inventory_report.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleMovementComplete = (movement: StockMovement, updatedItem: InventoryItem) => {
    setItems(prevItems => prevItems.map(item => item.id === updatedItem.id ? updatedItem : item));
    setMovements(prevMovements => [movement, ...prevMovements]);
    showToast(`${movement.type === 'check_in' ? 'Check-in' : 'Check-out'} of ${movement.quantity} ${movement.unit} for "${movement.itemName}" recorded successfully!`);
  };

  const handleAnalyzeStock = async (item: InventoryItem) => {
    setIsAnalyzing(true);
    setSuggestion(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 800));

      const prompt = `
        Analyze the following agricultural inventory item and suggest a replenishment and rotation strategy:
        Item: ${item.name}
        Category: ${item.type}
        Current Balance: ${item.quantity} ${item.unit}
        Average Consumption: ${item.avgConsumption || 'Standard'}
        Status: ${item.status}
        Last Unit Price: ${item.lastPurchasePrice || 'Market rate'}
        
        Return ONLY valid JSON (no markdown):
        {
          "recommendedQty": "suggested purchase quantity with unit",
          "reasoning": "concise technical rationale (max 2 sentences)",
          "estimatedCost": "total estimated cost formatted in USD ($)",
          "priority": "High" | "Medium" | "Low"
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
          console.warn("Gemini API call skipped, using local fallback:", apiError);
        }
      }

      if (!responseData) {
        if (item.status === 'critical_stock') {
          responseData = {
            recommendedQty: item.type === 'supplement' ? '45 bags' : '120 gallons',
            reasoning: `Based on an average consumption rate of ${item.avgConsumption || 'current cycle'}, the current stock will be depleted within 5 days. Recommend reordering for a 90-day buffer.`,
            estimatedCost: item.type === 'supplement' ? '$2,160.00' : '$4,620.00',
            priority: 'High'
          };
        } else {
          responseData = {
            recommendedQty: 'Preventive FIFO rotation',
            reasoning: 'Prioritize field application of the oldest batch to avoid expiration loss while scheduling replenishment.',
            estimatedCost: '$0.00',
            priority: 'Medium'
          };
        }
      }

      setSuggestion({ ...responseData, item });
    } catch (error) {
      console.error("AI Stock Analysis error:", error);
      setSuggestion({
        item,
        recommendedQty: 'Immediate utilization',
        reasoning: 'Agronomic recommendation: enforce FIFO rotation on batches nearing expiration date.',
        estimatedCost: 'Local quote pending',
        priority: item.status.includes('critical') ? 'High' : 'Medium'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleScanInvoice = async () => {
    setIsScanningInvoice(true);
    setTimeout(() => {
      setIsScanningInvoice(false);
      const mockResult = {
        supplier: "Midwest Ag Supply Co.",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        items: [
          { name: "Certified Soybean Seed (Trait 2)", qty: "40 bags", unit_price: "$185.00" },
          { name: "Glyphosate 4-Plus Herbicide (30 Gal Drum)", qty: "4 drums", unit_price: "$420.00" }
        ],
        total: "$9,080.00"
      };
      setScannedInvoiceData(mockResult);
    }, 2000);
  };

  const filteredItems = items
    .filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(item => {
      if (filterView === 'alerts') return item.status !== 'ok';
      return true;
    });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-stone-700 animate-in slide-in-from-top-2">
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.stock_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">
            {t.stock_subtitle}
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsQRScannerOpen(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-orange-900/20 active:scale-95 cursor-pointer"
          >
            <Camera size={20} />
            <span>{t.stock_scan_qr}</span>
          </button>

          <button 
            onClick={handleExportCSV}
            className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-2.5 rounded-xl font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center gap-2 text-sm cursor-pointer"
          >
            <Download size={18} />
            <span className="hidden sm:inline">
              {language === 'es' ? 'Exportar Reporte CSV' : language === 'pt' ? 'Exportar Relatório CSV' : 'Export CSV Report'}
            </span>
          </button>
        </div>
      </header>

      {/* Action Banners Grid: QR Code Check-in/Out & OCR Invoice */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Card 1: Camera QR Scanner (Check-in / Check-out) */}
        <section className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-3xl p-6 sm:p-7 shadow-xl shadow-orange-900/10 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold text-white mb-4">
              <QrCode size={14} />
              {language === 'es' ? 'Cámara del Dispositivo • Lector QR en Tiempo Real' : language === 'pt' ? 'Câmera do Aparelho • Leitor QR em Tempo Real' : 'Device Camera • Real-Time Scanner'}
            </div>

            <h3 className="text-2xl font-black mb-2">
              {language === 'es' ? 'Entradas y Salidas de Stock con QR' : language === 'pt' ? 'Entradas & Baixas de Estoque via QR' : 'QR Code Check-in & Check-out'}
            </h3>
            <p className="text-orange-50 text-sm leading-relaxed mb-6">
              {language === 'es' 
                ? 'Apunte la cámara hacia la etiqueta QR del insumo para registrar recepciones o despachos inmediatos a campo.' 
                : language === 'pt' 
                  ? 'Aponte a câmera para o QR Code da embalagem para dar entrada ou registrar retiradas para o campo.'
                  : 'Point your camera at the asset QR tag on input containers or seeds to record delivery receipts or issue immediate field withdrawals.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setIsQRScannerOpen(true)}
              className="bg-white text-orange-700 hover:bg-orange-50 font-bold px-6 py-3.5 rounded-2xl shadow-lg transition-all flex items-center gap-2.5 text-sm active:scale-95 cursor-pointer"
            >
              <Camera size={20} className="text-orange-600" />
              {language === 'es' ? 'Abrir Cámara y Escanear' : language === 'pt' ? 'Abrir Câmera e Escanear' : 'Launch Camera Scanner'}
            </button>

            <span className="text-xs text-orange-100 flex items-center gap-1">
              <History size={14} /> {movements.length} {language === 'es' ? 'movimientos registrados' : language === 'pt' ? 'movimentações' : 'logged operations'}
            </span>
          </div>
        </section>

        {/* Card 2: Automated Invoice Entry */}
        <section className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white rounded-3xl p-6 sm:p-7 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden flex flex-col justify-between transition-colors duration-300">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-100 dark:bg-stone-800 rounded-full text-xs font-bold text-stone-600 dark:text-stone-300 mb-4">
              <ScanLine size={14} className="text-primary" />
              {language === 'es' ? 'Reconocimiento Inteligente de Facturas' : language === 'pt' ? 'Entrada Automatizada de Documentos' : 'Automated Document Entry'}
            </div>

            <h3 className="text-2xl font-bold mb-2">
              {language === 'es' ? 'OCR de Facturas de Proveedores' : language === 'pt' ? 'OCR de Notas Fiscais e Boletos' : 'Supplier Invoice OCR'}
            </h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm leading-relaxed mb-6">
              {language === 'es' 
                ? 'Fotografíe facturas o remitos de agroquímicos y semillas para ingresar lotes y actualizar costos contables al instante.' 
                : language === 'pt' 
                  ? 'Tire uma foto de notas fiscais para registrar lotes de insumos e atualizar custos automaticamente.'
                  : 'Take a photo of delivery slips or chemical invoices to register batches into stock and update accounting records automatically.'}
            </p>
          </div>

          <div className="pt-2">
            <button 
              onClick={handleScanInvoice}
              disabled={isScanningInvoice}
              className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-stone-100 px-6 py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {isScanningInvoice ? (
                <>
                  <ScanLine size={18} className="animate-spin text-orange-500" /> 
                  {language === 'es' ? 'Analizando Factura con IA...' : language === 'pt' ? 'Processando Nota com IA...' : 'Analyzing Invoice OCR...'}
                </>
              ) : (
                <>
                  <Camera size={18} /> 
                  {language === 'es' ? 'Fotografiar Factura Proveedor' : language === 'pt' ? 'Fotografar Nota Fiscal' : 'Capture Supplier Invoice'}
                </>
              )}
            </button>
          </div>
        </section>
      </div>

      {/* Scanned Invoice Result */}
      {scannedInvoiceData && (
        <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl shadow-lg border-2 border-orange-200 dark:border-orange-800 animate-in zoom-in-95">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h4 className="font-bold text-lg text-stone-900 dark:text-white">Processed Invoice Data</h4>
              <p className="text-stone-500 dark:text-stone-400 text-sm">{scannedInvoiceData.supplier} • {scannedInvoiceData.date}</p>
            </div>
            <button 
              onClick={() => setScannedInvoiceData(null)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
              aria-label="Close invoice preview"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 mb-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-stone-500 border-b border-stone-200 dark:border-stone-700">
                  <th className="pb-2">Item Description</th>
                  <th className="pb-2">Qty</th>
                  <th className="pb-2 text-right">Unit Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 dark:divide-stone-700">
                {scannedInvoiceData.items.map((item: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium text-stone-800 dark:text-stone-200">{item.name}</td>
                    <td className="py-2.5 text-stone-600 dark:text-stone-400">{item.qty}</td>
                    <td className="py-2.5 text-right font-medium text-stone-800 dark:text-stone-200">{item.unit_price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <span className="font-bold text-xl text-stone-900 dark:text-white">Invoice Total: {scannedInvoiceData.total}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setScannedInvoiceData(null)}
                className="px-4 py-2 rounded-xl text-stone-600 dark:text-stone-400 font-semibold text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
              >
                Discard
              </button>
              <button 
                onClick={() => {
                  showToast('Stock receipt registered from invoice!');
                  setScannedInvoiceData(null);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-md transition-colors"
              >
                Confirm Receipt Entry
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Filter Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-stone-200 dark:border-stone-800 pb-3">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            onClick={() => setFilterView('alerts')}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              filterView === 'alerts'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <AlertTriangle size={16} />
            {language === 'es' ? 'Radar de Alertas' : language === 'pt' ? 'Radar de Alertas' : 'Alert Radar'} ({items.filter(i => i.status !== 'ok').length})
          </button>

          <button
            onClick={() => setFilterView('all')}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              filterView === 'all'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <PackageCheck size={16} />
            {language === 'es' ? 'Todos los Insumos' : language === 'pt' ? 'Todos os Insumos' : 'All Supplies'} ({items.length})
          </button>

          <button
            onClick={() => setFilterView('movements')}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-colors flex items-center gap-2 cursor-pointer ${
              filterView === 'movements'
                ? 'bg-orange-600 text-white shadow-md shadow-orange-900/20'
                : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
            }`}
          >
            <History size={16} />
            {language === 'es' ? 'Movimientos QR' : language === 'pt' ? 'Movimentações QR' : 'QR Movements'} ({movements.length})
          </button>
        </div>

        {filterView !== 'movements' && (
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={17} />
            <input 
              type="text" 
              placeholder={t.stock_search_placeholder} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
            />
          </div>
        )}
      </div>

      {/* Main View: Items Radar / All Items */}
      {filterView !== 'movements' ? (
        <section>
          {filteredItems.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-8">
              <PackageCheck size={48} className="mx-auto text-stone-400 mb-3" />
              <h4 className="font-bold text-lg text-stone-800 dark:text-white">No items found</h4>
              <p className="text-sm text-stone-500 mt-1">
                {searchQuery ? 'Try searching with another keyword.' : 'All items are currently at safe inventory levels!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const ItemIcon = getItemIcon(item.type);
                return (
                  <div 
                    key={item.id} 
                    className={`border p-4 sm:p-5 rounded-2xl flex flex-col justify-between gap-4 transition-all hover:shadow-md ${getStatusStyle(item.status)}`}
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="bg-white dark:bg-stone-800 p-3 rounded-xl shadow-sm shrink-0">
                        <ItemIcon size={24} className={
                          item.status === 'critical_expiration' ? 'text-red-500' :
                          item.status === 'critical_stock' ? 'text-orange-500' :
                          item.status === 'warning_expiration' ? 'text-yellow-600 dark:text-yellow-500' :
                          'text-emerald-600'
                        } />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-base sm:text-lg text-stone-900 dark:text-white truncate">
                            {item.name}
                          </h4>
                          <span className="text-xs font-mono text-stone-400 shrink-0">
                            ID #{item.id}
                          </span>
                        </div>
                        <div className="mt-1">
                          {getStatusLabel(item)}
                        </div>
                        {item.avgConsumption && (
                          <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                            Usage rate: {item.avgConsumption}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-700/60 gap-2">
                      <button
                        onClick={() => setSelectedQRItem(item)}
                        className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
                        title="View and Print QR Tag"
                      >
                        <QrCode size={15} className="text-orange-500" />
                        <span>QR Code Tag</span>
                      </button>

                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleAnalyzeStock(item)}
                          disabled={isAnalyzing}
                          className="px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-indigo-200 dark:border-indigo-800"
                        >
                          {isAnalyzing ? <ScanLine size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                          <span>AI Restock</span>
                        </button>

                        <button 
                          onClick={() => setIsQRScannerOpen(true)}
                          className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Camera size={14} />
                          <span>Check-in/Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      ) : (
        /* Movement History Section */
        <section className="bg-white dark:bg-stone-900 rounded-3xl shadow-sm border border-stone-200 dark:border-stone-800 p-5 sm:p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
                <History className="text-orange-500" />
                QR Movement History (Check-in & Check-out)
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Audit log of all warehouse receipts and field withdrawals.
              </p>
            </div>
            
            <button 
              onClick={() => setIsQRScannerOpen(true)}
              className="bg-orange-600 text-white hover:bg-orange-700 px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
            >
              <Camera size={14} />
              New QR Scan
            </button>
          </div>

          {movements.length === 0 ? (
            <div className="text-center py-12 text-stone-500 text-sm">
              No inventory movements logged yet. Click above to scan a QR code.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 dark:text-stone-400 uppercase bg-stone-50 dark:bg-stone-800/60">
                  <tr>
                    <th className="px-4 py-3 rounded-l-xl">Operation</th>
                    <th className="px-4 py-3">Item Name</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3 text-center">Previous ➔ New Balance</th>
                    <th className="px-4 py-3">Purpose / Location</th>
                    <th className="px-4 py-3">Operator</th>
                    <th className="px-4 py-3 text-right rounded-r-xl">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {movements.map((mov) => (
                    <tr key={mov.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/40 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                          mov.type === 'check_in'
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                        }`}>
                          {mov.type === 'check_in' ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />}
                          {mov.type === 'check_in' ? 'Check-in (Receive)' : 'Check-out (Issue)'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-bold text-stone-900 dark:text-white whitespace-nowrap">
                        {mov.itemName}
                      </td>

                      <td className="px-4 py-3.5 text-center font-bold text-stone-900 dark:text-white">
                        <span className={mov.type === 'check_in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                          {mov.type === 'check_in' ? '+' : '-'}{mov.quantity} {mov.unit}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-center text-xs text-stone-500 whitespace-nowrap">
                        <span className="line-through">{mov.previousQty}</span> ➔ <strong className="text-stone-800 dark:text-stone-200">{mov.newQty} {mov.unit}</strong>
                      </td>

                      <td className="px-4 py-3.5 text-xs text-stone-600 dark:text-stone-300 max-w-xs truncate">
                        <div>{mov.reason}</div>
                        {mov.destination && <div className="text-stone-400 font-mono text-[11px]">{mov.destination}</div>}
                      </td>

                      <td className="px-4 py-3.5 text-xs text-stone-600 dark:text-stone-300 whitespace-nowrap flex items-center gap-1.5 mt-1">
                        <User size={13} className="text-stone-400" />
                        {mov.operator}
                      </td>

                      <td className="px-4 py-3.5 text-right text-xs text-stone-400 whitespace-nowrap">
                        {mov.timestamp}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* AI Suggestion Modal */}
      {suggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-700 overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white relative">
              <button 
                onClick={() => setSuggestion(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white"
                aria-label="Close suggestion modal"
              >
                <X size={22} />
              </button>
              <div className="flex items-center gap-3 mb-2">
                <BrainCircuit size={28} className="text-white" />
                <h3 className="font-bold text-xl">AI Restock Strategy</h3>
              </div>
              <p className="text-indigo-100 text-xs">Agronomic consumption & inventory forecast.</p>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start border-b border-stone-100 dark:border-stone-800 pb-3">
                <div>
                  <p className="text-xs text-stone-500 dark:text-stone-400 uppercase font-bold">Analyzed Item</p>
                  <p className="font-bold text-stone-900 dark:text-white text-base">{suggestion.item.name}</p>
                </div>
                <div className="bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 dark:border-indigo-800">
                  Priority: {suggestion.priority}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-2xl">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Recommended Order</p>
                  <p className="font-bold text-stone-900 dark:text-white text-lg">{suggestion.recommendedQty}</p>
                </div>
                <div className="bg-stone-50 dark:bg-stone-800 p-3 rounded-2xl">
                  <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">Estimated Cost</p>
                  <p className="font-bold text-stone-900 dark:text-white text-lg">{suggestion.estimatedCost}</p>
                </div>
              </div>

              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl border border-indigo-100 dark:border-indigo-800/50">
                <div className="flex gap-2 mb-1.5">
                  <Sparkles size={16} className="text-indigo-600 dark:text-indigo-400 mt-0.5" />
                  <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Agronomic Rationale</p>
                </div>
                <p className="text-xs text-indigo-800 dark:text-indigo-300 leading-relaxed">
                  {suggestion.reasoning}
                </p>
              </div>

              <button 
                onClick={() => {
                  showToast('Purchase order request sent to procurement!');
                  setSuggestion(null);
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-2xl transition-colors shadow-lg shadow-indigo-900/20 text-sm"
              >
                Generate Purchase Order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Camera Scanner Modal */}
      <StockQRScannerModal
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
        items={items}
        onMovementComplete={handleMovementComplete}
      />

      {/* Item QR Code View & Print Modal */}
      <ItemQRCodeModal
        item={selectedQRItem}
        onClose={() => setSelectedQRItem(null)}
      />

    </div>
  );
}

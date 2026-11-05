import { useEffect, useState } from 'react';
import { X, QrCode, Download, Printer, Copy, Check } from 'lucide-react';
import QRCode from 'qrcode';
import { InventoryItem } from './StockQRScannerModal';

interface ItemQRCodeModalProps {
  item: InventoryItem | null;
  onClose: () => void;
}

export default function ItemQRCodeModal({ item, onClose }: ItemQRCodeModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!item) return;

    const payload = JSON.stringify({
      id: item.id,
      sku: `AGRO-ITM-${String(item.id).padStart(4, '0')}`,
      name: item.name,
      type: item.type,
      unit: item.unit
    });

    QRCode.toDataURL(payload, {
      width: 320,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('Error generating QR code:', err));
  }, [item]);

  if (!item) return null;

  const sku = `AGRO-ITM-${String(item.id).padStart(4, '0')}`;

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `qrcode_${item.name.replace(/\s+/g, '_').toLowerCase()}.png`;
    link.click();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sku);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Asset Label - ${item.name}</title>
          <style>
            body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; }
            .card { border: 2px dashed #333; padding: 24px; border-radius: 12px; text-align: center; width: 290px; }
            h2 { margin: 10px 0 4px; font-size: 18px; color: #111; }
            p { margin: 4px 0; color: #555; font-size: 13px; }
            img { width: 210px; height: 210px; }
            .sku { font-family: monospace; font-weight: bold; background: #eee; padding: 5px 10px; border-radius: 4px; display: inline-block; margin-top: 10px; font-size: 14px; }
            .brand { font-size: 11px; letter-spacing: 1px; color: #777; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="brand">AGROTECH ENTERPRISE • INVENTORY TAG</div>
            <img src="${qrDataUrl}" />
            <h2>${item.name}</h2>
            <p>Category: ${item.type} | Unit: ${item.unit}</p>
            <div class="sku">${sku}</div>
          </div>
          <script>
            window.onload = () => { window.print(); window.close(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-sm w-full border border-stone-200 dark:border-stone-800 overflow-hidden text-center transition-colors">
        
        {/* Header */}
        <div className="p-4 bg-stone-100 dark:bg-stone-800 flex justify-between items-center border-b border-stone-200 dark:border-stone-700">
          <div className="flex items-center gap-2 text-stone-900 dark:text-white font-bold text-sm">
            <QrCode size={18} className="text-orange-500" />
            QR Asset Tag Label
          </div>
          <button 
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code Container */}
        <div className="p-6 space-y-4">
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-stone-200 inline-block">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR Code ${item.name}`} 
                className="w-52 h-52 object-contain"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center text-stone-400 text-sm">
                Generating QR code...
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-lg text-stone-900 dark:text-white">{item.name}</h4>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
              Current Stock: {item.quantity} {item.unit} • {item.avgConsumption || 'Tracked Asset'}
            </p>
            <div className="mt-2 inline-flex items-center gap-2 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full text-xs font-mono text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
              <span>{sku}</span>
              <button 
                onClick={handleCopyCode}
                className="hover:text-orange-500 transition-colors"
                title="Copy SKU code"
              >
                {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleDownload}
              className="py-2.5 px-3 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download size={14} /> Download PNG
            </button>

            <button
              onClick={handlePrint}
              className="py-2.5 px-3 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-orange-900/20 transition-colors"
            >
              <Printer size={14} /> Print Tag Label
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

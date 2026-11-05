import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  X, Camera, FlipHorizontal, Zap, ZapOff, Upload, 
  ArrowDownRight, ArrowUpRight, CheckCircle2, AlertCircle, 
  Package, Sparkles
} from 'lucide-react';
import jsQR from 'jsqr';

export interface InventoryItem {
  id: number;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  daysToExpire: number;
  status: string;
  avgConsumption?: string;
  lastPurchasePrice?: string;
}

export interface StockMovement {
  id: string;
  itemId: number;
  itemName: string;
  type: 'check_in' | 'check_out';
  quantity: number;
  unit: string;
  previousQty: number;
  newQty: number;
  reason: string;
  operator: string;
  destination?: string;
  timestamp: string;
}

interface StockQRScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: InventoryItem[];
  onMovementComplete: (movement: StockMovement, updatedItem: InventoryItem) => void;
}

export default function StockQRScannerModal({
  isOpen,
  onClose,
  items,
  onMovementComplete
}: StockQRScannerModalProps) {
  // Scanner States
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchOn, setTorchOn] = useState(false);
  const [hasTorch, setHasTorch] = useState(false);
  
  // Scanned item & action form state
  const [, setScannedCode] = useState<string | null>(null);
  const [matchedItem, setMatchedItem] = useState<InventoryItem | null>(null);
  const [movementType, setMovementType] = useState<'check_in' | 'check_out'>('check_out');
  const [quantity, setQuantity] = useState<number>(1);
  const [reason, setReason] = useState<string>('Field Application');
  const [operator, setOperator] = useState<string>('Field Technician');
  const [destination, setDestination] = useState<string>('Field Plot #02');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
    setCameraActive(false);
    setTorchOn(false);
  }, []);

  // Match scanned code string to an item
  const processDecodedString = useCallback((rawText: string) => {
    setScannedCode(rawText);

    let targetId: number | null = null;
    try {
      const parsed = JSON.parse(rawText);
      if (parsed.id) targetId = Number(parsed.id);
    } catch {
      const match = rawText.match(/(\d+)/);
      if (match) {
        targetId = parseInt(match[1], 10);
      }
    }

    let found = items.find(i => i.id === targetId);
    if (!found) {
      const lower = rawText.toLowerCase();
      found = items.find(i => lower.includes(i.name.toLowerCase()) || i.name.toLowerCase().includes(lower));
    }

    if (found) {
      setMatchedItem(found);
      setQuantity(1);
      setMovementType('check_out');
      setNotification({
        type: 'success',
        message: `Item identified: ${found.name}`
      });
    } else {
      setMatchedItem(null);
      setNotification({
        type: 'error',
        message: `Scanned code ("${rawText}"), but no matching item was found in the inventory database.`
      });
    }
  }, [items]);

  // Frame scanning loop
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });

      if (code && code.data) {
        processDecodedString(code.data);
        try {
          const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.frequency.value = 880;
          gain.gain.value = 0.08;
          osc.start();
          setTimeout(() => {
            osc.stop();
            audioCtx.close();
          }, 120);
        } catch {
          // Audio feedback optional
        }
        return;
      }
    }

    animationFrameId.current = requestAnimationFrame(scanFrame);
  }, [processDecodedString]);

  // Start Camera
  const startCamera = useCallback(async () => {
    setCameraError(null);
    stopCamera();

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setCameraActive(true);

        const track = stream.getVideoTracks()[0];
        const capabilities: any = track.getCapabilities ? track.getCapabilities() : {};
        setHasTorch(Boolean(capabilities.torch));

        animationFrameId.current = requestAnimationFrame(scanFrame);
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(
        err.name === 'NotAllowedError' 
          ? 'Camera permission denied. Please allow camera access in browser settings or use the instant test simulation below.'
          : 'Camera is unavailable on this device. You can upload an image or use the instant simulation options below.'
      );
      setCameraActive(false);
    }
  }, [facingMode, scanFrame, stopCamera]);

  const toggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    try {
      const nextTorch = !torchOn;
      await (track as any).applyConstraints({
        advanced: [{ torch: nextTorch }]
      });
      setTorchOn(nextTorch);
    } catch (err) {
      console.warn('Torch toggle failed:', err);
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const img = new Image();
    const reader = new FileReader();

    reader.onload = (event) => {
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            processDecodedString(code.data);
          } else {
            setNotification({
              type: 'error',
              message: 'No valid QR code was detected in the selected image file.'
            });
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScannedCode(null);
      setMatchedItem(null);
      setNotification(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode, startCamera, stopCamera]);

  const handleSimulateScan = (item: InventoryItem) => {
    processDecodedString(JSON.stringify({ id: item.id, sku: `AGRO-${item.id}`, name: item.name }));
  };

  const handleConfirmMovement = () => {
    if (!matchedItem) return;
    if (quantity <= 0) {
      setNotification({ type: 'error', message: 'Quantity must be greater than zero.' });
      return;
    }

    const previousQty = matchedItem.quantity;
    let newQty = previousQty;

    if (movementType === 'check_in') {
      newQty = previousQty + quantity;
    } else {
      if (quantity > previousQty) {
        setNotification({
          type: 'error',
          message: `Insufficient inventory! Current balance is only ${previousQty} ${matchedItem.unit}.`
        });
        return;
      }
      newQty = previousQty - quantity;
    }

    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      itemId: matchedItem.id,
      itemName: matchedItem.name,
      type: movementType,
      quantity,
      unit: matchedItem.unit,
      previousQty,
      newQty,
      reason,
      operator: operator || 'Staff Operator',
      destination,
      timestamp: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    const updatedItem: InventoryItem = {
      ...matchedItem,
      quantity: newQty,
      status: newQty === 0 
        ? 'critical_stock' 
        : newQty < 10 && matchedItem.status !== 'critical_expiration' 
          ? 'critical_stock' 
          : matchedItem.status
    };

    onMovementComplete(movement, updatedItem);

    setNotification({
      type: 'success',
      message: `${movementType === 'check_in' ? 'Check-in (Receive)' : 'Check-out (Field Issue)'} of ${quantity} ${matchedItem.unit} completed successfully!`
    });

    setTimeout(() => {
      setMatchedItem(null);
      setScannedCode(null);
      if (videoRef.current && cameraActive) {
        animationFrameId.current = requestAnimationFrame(scanFrame);
      }
    }, 1800);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-2xl w-full border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-orange-600 to-amber-600 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Camera size={22} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg sm:text-xl flex items-center gap-2">
                QR Code Scanner • Inventory
              </h3>
              <p className="text-xs text-orange-100">Check-in (Receive) and Check-out (Field Issue)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors text-white"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          
          {/* Notification Alert Banner */}
          {notification && (
            <div className={`p-3.5 rounded-xl text-sm flex items-start gap-2.5 transition-all ${
              notification.type === 'success' 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
            }`}>
              {notification.type === 'success' ? (
                <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
              )}
              <span className="flex-1 font-medium">{notification.message}</span>
            </div>
          )}

          {/* Action Form if Item is Matched */}
          {matchedItem ? (
            <div className="bg-stone-50 dark:bg-stone-800/60 rounded-2xl p-4 sm:p-5 border border-stone-200 dark:border-stone-700 space-y-4 animate-in zoom-in-95">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-200 dark:border-stone-700 pb-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-400">Identified Item</span>
                  <h4 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                    <Package className="text-primary" size={20} />
                    {matchedItem.name}
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-stone-500 dark:text-stone-400">Current Stock:</span>
                  <span className="px-2.5 py-1 bg-white dark:bg-stone-700 rounded-lg text-sm font-bold text-stone-900 dark:text-white border border-stone-200 dark:border-stone-600">
                    {matchedItem.quantity} {matchedItem.unit}
                  </span>
                </div>
              </div>

              {/* Mode Selector: Check-in vs Check-out */}
              <div>
                <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-2">
                  Action Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setMovementType('check_out')}
                    className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                      movementType === 'check_out'
                        ? 'border-amber-500 bg-amber-500/10 text-amber-700 dark:text-amber-300 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <ArrowDownRight size={18} className="text-amber-600" />
                    Check-out (Field Issue)
                  </button>

                  <button
                    type="button"
                    onClick={() => setMovementType('check_in')}
                    className={`p-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                      movementType === 'check_in'
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 shadow-sm'
                        : 'border-stone-200 dark:border-stone-700 text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800'
                    }`}
                  >
                    <ArrowUpRight size={18} className="text-emerald-600" />
                    Check-in (Receive Stock)
                  </button>
                </div>
              </div>

              {/* Quantity Stepper & Quick Presets */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-600 dark:text-stone-300 uppercase">
                    Quantity ({matchedItem.unit})
                  </label>
                  <span className="text-xs text-stone-500 dark:text-stone-400">
                    Projected balance:{' '}
                    <strong className={movementType === 'check_in' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                      {movementType === 'check_in' ? matchedItem.quantity + quantity : Math.max(0, matchedItem.quantity - quantity)} {matchedItem.unit}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-white font-bold text-xl flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-12 text-center text-xl font-bold bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-xl text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 rounded-xl bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-white font-bold text-xl flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
                  >
                    +
                  </button>
                </div>

                {/* Quick Add Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {[5, 10, 20, 50].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setQuantity(num)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                        quantity === num
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white dark:bg-stone-700 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-600 hover:border-orange-500'
                      }`}
                    >
                      {num} {matchedItem.unit}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setQuantity(matchedItem.quantity)}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border border-stone-300 dark:border-stone-600 hover:border-orange-500"
                  >
                    Max ({matchedItem.quantity})
                  </button>
                </div>
              </div>

              {/* Destination / Reason */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    {movementType === 'check_in' ? 'Source / Supplier' : 'Destination / Plot / Lot'}
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder={movementType === 'check_in' ? 'e.g., Central Supply Co.' : 'e.g., North Field #04 / Pen A'}
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-xl text-sm text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-600 dark:text-stone-300 uppercase mb-1">
                    Operator / Responsible Person
                  </label>
                  <input
                    type="text"
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    placeholder="e.g., John Miller"
                    className="w-full px-3 py-2 bg-white dark:bg-stone-900 border border-stone-300 dark:border-stone-600 rounded-xl text-sm text-stone-900 dark:text-white outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* Confirm Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMatchedItem(null);
                    setScannedCode(null);
                    if (videoRef.current && cameraActive) {
                      animationFrameId.current = requestAnimationFrame(scanFrame);
                    }
                  }}
                  className="flex-1 py-3 px-4 rounded-xl border border-stone-300 dark:border-stone-600 font-semibold text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition-colors text-sm"
                >
                  Scan Another Code
                </button>

                <button
                  type="button"
                  onClick={handleConfirmMovement}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-white shadow-lg transition-all text-sm flex items-center justify-center gap-2 ${
                    movementType === 'check_in'
                      ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/20'
                      : 'bg-amber-600 hover:bg-amber-700 shadow-amber-900/20'
                  }`}
                >
                  <CheckCircle2 size={18} />
                  Confirm {movementType === 'check_in' ? 'Check-in' : 'Check-out'}
                </button>
              </div>

            </div>
          ) : (
            /* Live Camera Viewfinder Area */
            <div className="space-y-4">
              <div className="relative aspect-video sm:aspect-[4/3] max-h-72 w-full bg-stone-950 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center">
                
                {/* Video feed */}
                <video 
                  ref={videoRef}
                  className="w-full h-full object-cover"
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Viewfinder Target Graphic */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-48 h-48 sm:w-56 sm:h-56 border-2 border-white/60 rounded-2xl relative flex items-center justify-center shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-orange-500 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-orange-500 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-orange-500 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-orange-500 rounded-br-lg"></div>
                    
                    <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_8px_#f97316] animate-pulse"></div>
                  </div>
                </div>

                {/* Overlay Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                      title={torchOn ? 'Turn off Flashlight' : 'Turn on Flashlight'}
                    >
                      {torchOn ? <Zap size={18} className="text-yellow-400" /> : <ZapOff size={18} />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={flipCamera}
                    className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors"
                    title="Flip Camera"
                  >
                    <FlipHorizontal size={18} />
                  </button>
                </div>

                {/* Camera Status Label */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs text-white/90 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  Align QR Code within the frame to scan
                </div>
              </div>

              {/* Camera Error Message */}
              {cameraError && (
                <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                  <p className="font-semibold mb-1 flex items-center gap-1">
                    <AlertCircle size={14} /> Camera Notice
                  </p>
                  <p>{cameraError}</p>
                </div>
              )}

              {/* Upload Image Option */}
              <div className="flex items-center justify-between gap-3 text-xs text-stone-500 dark:text-stone-400 pt-1">
                <span>No camera available on this workstation?</span>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  accept="image/*" 
                  onChange={handleFileUpload} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg text-stone-700 dark:text-stone-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Upload size={14} /> Upload QR Image File
                </button>
              </div>

              {/* Quick simulation buttons for testing */}
              <div className="border-t border-stone-100 dark:border-stone-800 pt-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-stone-500 uppercase flex items-center gap-1">
                    <Sparkles size={14} className="text-orange-500" />
                    Instant Test Simulation (No Camera Required)
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {items.slice(0, 6).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSimulateScan(item)}
                      className="p-2.5 text-left bg-stone-50 dark:bg-stone-800/80 hover:bg-orange-50 dark:hover:bg-orange-950/30 border border-stone-200 dark:border-stone-700 hover:border-orange-400 rounded-xl text-xs transition-colors truncate"
                    >
                      <div className="font-bold text-stone-900 dark:text-white truncate">{item.name}</div>
                      <div className="text-stone-500 dark:text-stone-400">{item.quantity} {item.unit}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 dark:bg-stone-800/80 border-t border-stone-200 dark:border-stone-700 flex justify-between items-center text-xs text-stone-500 dark:text-stone-400">
          <span>AgroTech Enterprise • GS1 Barcode & QR Protocol</span>
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-stone-200 font-semibold rounded-lg hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

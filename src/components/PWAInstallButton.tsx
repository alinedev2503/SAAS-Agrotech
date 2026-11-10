import { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { useLanguage } from '../contexts/LanguageContext';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'primary' | 'outline' | 'compact';
}

export function PWAInstallButton({ className = '', variant = 'primary' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { language } = useLanguage();

  if (isInstalled) {
    return null;
  }

  const labels = {
    pt: {
      install: 'Instalar App',
      installIOS: 'Instalar no Celular',
      titleIOS: 'Instalar no iPhone / iPad',
      step1: '1. Toque no botão Compartilhar na barra do Safari.',
      step2: '2. Role para baixo e selecione "Adicionar à Tela de Início".',
      close: 'Entendi',
    },
    es: {
      install: 'Instalar App',
      installIOS: 'Instalar en Móvil',
      titleIOS: 'Instalar en iPhone / iPad',
      step1: '1. Toque el botón Compartir en la barra de Safari.',
      step2: '2. Deslice hacia abajo y seleccione "Agregar a Inicio".',
      close: 'Entendido',
    },
    en: {
      install: 'Install App',
      installIOS: 'Install on Mobile',
      titleIOS: 'Install on iPhone / iPad',
      step1: '1. Tap the Share button in Safari toolbar.',
      step2: '2. Scroll down and tap "Add to Home Screen".',
      close: 'Close',
    },
  }[language] || {
    install: 'Install App',
    installIOS: 'Install on Mobile',
    titleIOS: 'Install on iPhone / iPad',
    step1: '1. Tap the Share button in Safari toolbar.',
    step2: '2. Scroll down and tap "Add to Home Screen".',
    close: 'Close',
  };

  const baseStyle =
    variant === 'compact'
      ? 'px-2.5 py-1 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all cursor-pointer'
      : variant === 'outline'
      ? 'px-3.5 py-2 text-xs font-bold rounded-xl border border-stone-200 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200 flex items-center gap-2 transition-all cursor-pointer'
      : 'px-4 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-primary-hover text-white shadow-md shadow-primary/20 flex items-center gap-2 transition-all active:scale-95 cursor-pointer';

  // Android / Chromium / Desktop prompt
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`${baseStyle} ${className}`}
        title={labels.install}
      >
        <Download size={14} />
        <span>{labels.install}</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`${baseStyle} ${className}`}
          title={labels.installIOS}
        >
          <Smartphone size={14} />
          <span>{labels.installIOS}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 shadow-2xl text-stone-900 dark:text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 font-bold text-base">
                  <Smartphone size={18} className="text-primary" />
                  <h3>{labels.titleIOS}</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                <p>{labels.step1}</p>
                <p>{labels.step2}</p>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-primary py-2.5 text-xs font-bold text-white hover:bg-primary-hover transition-colors cursor-pointer"
              >
                {labels.close}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
}

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessToastProps {
  message: string | null;
  onClose: () => void;
}

export function SuccessToast({ message, onClose }: SuccessToastProps) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-20 right-4 z-50 bg-stone-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 border border-stone-700"
        >
          <CheckCircle2 size={18} className="text-emerald-400" />
          <span className="text-sm font-medium">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

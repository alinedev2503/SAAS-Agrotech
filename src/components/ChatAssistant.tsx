import { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";
import { useLanguage } from '../contexts/LanguageContext';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export default function ChatAssistant() {
  const { language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  
  const getWelcomeMessage = (lang: string) => {
    switch (lang) {
      case 'es':
        return "¡Hola! Soy tu Copiloto AgroTech. Puedo ayudarte con futuros de granos, sanidad del ganado, períodos de carencia, dosis de siembra o niveles de stock. ¿Qué deseas consultar hoy?";
      case 'pt':
        return "Olá! Sou seu Copiloto AgroTech. Posso ajudar com cotações de commodities, manejo sanitário, carência de medicamentos, estande de plantas e níveis de estoque. O que deseja consultar hoje?";
      default:
        return "Hello! I am your AgroTech Copilot. I can assist with grain futures, livestock health & withdrawal periods, seed rates, or inventory levels. What would you like to check today?";
    }
  };

  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([
    { role: 'model', text: getWelcomeMessage(language) }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message when language changes if no conversation started
  useEffect(() => {
    if (messages.length === 1 && messages[0].role === 'model') {
      setMessages([{ role: 'model', text: getWelcomeMessage(language) }]);
    }
  }, [language]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsLoading(true);

    try {
      const model = "gemini-2.5-flash";
      const langInstruction = language === 'es' 
        ? 'Provide concise, technical, and actionable agronomic advice in Spanish.' 
        : language === 'pt'
        ? 'Provide concise, technical, and actionable agronomic advice in Portuguese (Brazil).'
        : 'Provide concise, technical, and actionable advice in US English.';

      const response = await ai.models.generateContent({
        model: model,
        contents: [
          { role: 'user', parts: [{ text: `You are an expert agricultural consultant and farm management assistant for a farm operator. ${langInstruction} Context: AgroTech Farm Management Suite. Question: ${userMsg}` }] }
        ]
      });

      const text = response.text || (
        language === 'es' ? "No pude completar la consulta en este momento. Inténtalo de nuevo." :
        language === 'pt' ? "Não foi possível concluir a consulta agora. Tente novamente." :
        "I was unable to complete this query at the moment. Please try again."
      );
      setMessages(prev => [...prev, { role: 'model', text }]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: language === 'es' 
          ? "No se pudo conectar con el servicio de IA agronómica. Verifica la conexión o intenta más tarde."
          : language === 'pt'
          ? "Não foi possível conectar ao serviço de IA agrícola. Verifique a conexão e tente novamente."
          : "Unable to reach the agricultural AI service. Please verify your connection or try again."
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 transition-all cursor-pointer ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 scale-100 opacity-100'
        }`}
      >
        <Sparkles size={22} className="text-orange-500" />
        <span className="font-bold text-sm pr-1">
          {language === 'es' ? 'Copiloto IA' : language === 'pt' ? 'Copiloto IA' : 'AI Copilot'}
        </span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 w-full max-w-sm bg-white dark:bg-stone-900 rounded-2xl shadow-2xl border border-stone-200 dark:border-stone-800 z-50 overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-stone-900 dark:bg-stone-950 p-4 flex justify-between items-center text-white border-b border-stone-800">
              <div className="flex items-center gap-2.5">
                <div className="bg-orange-600 p-1.5 rounded-lg">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">AgroTech Copilot</h3>
                  <p className="text-[11px] text-stone-400">
                    {language === 'es' ? 'En línea • Asistente Agronómico con IA' : language === 'pt' ? 'Online • Assistente Agronômico IA' : 'Online • Agronomy AI Assistant'}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-900/50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user'
                        ? 'bg-orange-600 text-white rounded-tr-none shadow-xs'
                        : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-200 dark:border-stone-700 rounded-tl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-stone-800 p-3 rounded-2xl rounded-tl-none border border-stone-200 dark:border-stone-700 shadow-xs flex gap-1.5">
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-stone-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800">
              <div className="flex items-center gap-2 bg-stone-100 dark:bg-stone-800 rounded-xl p-2 border border-stone-200 dark:border-stone-700">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={
                    language === 'es' ? "Pregunta sobre cultivos, rodeo o insumos..." :
                    language === 'pt' ? "Pergunte sobre lavouras, rebanho ou estoque..." :
                    "Ask about crops, herd, or stock..."
                  }
                  className="flex-1 bg-transparent border-none outline-none text-sm text-stone-900 dark:text-white placeholder-stone-500"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="p-2 bg-stone-900 dark:bg-white text-white dark:text-stone-900 rounded-lg hover:bg-stone-800 dark:hover:bg-stone-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

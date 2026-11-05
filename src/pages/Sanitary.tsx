import { useState } from 'react';
import { Mic, QrCode, Syringe, Calendar, AlertCircle, CheckCircle2, Bell, BellRing, X, Clock } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useVoiceInput } from '../hooks/useVoiceInput';
import MiniCalendar from '../components/MiniCalendar';
import { useLanguage } from '../contexts/LanguageContext';

export default function Sanitary() {
  const { language, t } = useLanguage();
  const { isListening, processing, result: voiceResult, startListening } = useVoiceInput();
  
  // Reminder State
  const [reminderModal, setReminderModal] = useState<{isOpen: boolean, itemId: number | null}>({isOpen: false, itemId: null});
  const [reminders, setReminders] = useState<Record<number, string>>({}); // itemId -> reminder setting
  const [selectedReminderOption, setSelectedReminderOption] = useState<string>('1 day before');

  // Data for Charts
  const vaccinationData = [
    { name: t.san_vaccinated, value: 850, color: '#22c55e' }, // green-500
    { name: t.san_pending, value: 150, color: '#ef4444' }, // red-500
  ];

  const diseaseData = [
    { name: language === 'es' ? 'Mastitis' : language === 'pt' ? 'Mastite' : 'Mastitis', cases: 12 },
    { name: language === 'es' ? 'Neumonía' : language === 'pt' ? 'Pneumonia' : 'Pneumonia', cases: 8 },
    { name: language === 'es' ? 'Pietín' : language === 'pt' ? 'Pododermatite' : 'Foot Rot', cases: 5 },
    { name: language === 'es' ? 'Garrapatas' : language === 'pt' ? 'Carrapatos' : 'Ticks', cases: 25 },
  ];

  // Data for Vaccinations
  const today = new Date();
  const currentYear = today.getFullYear();
  
  const upcomingVaccinations = [
    { 
      id: 1, 
      type: language === 'es' ? 'Brucelosis (Cepa 19)' : language === 'pt' ? 'Brucelose (B19)' : 'Brucellosis (Strain 19)', 
      target: language === 'es' ? 'Terneras 3-8 meses' : language === 'pt' ? 'Bezerras 3-8 meses' : 'Heifers 3-8 mo', 
      date: new Date(today),
      displayDate: language === 'es' ? 'Hoy' : language === 'pt' ? 'Hoje' : 'Today',
      status: 'urgent' as const 
    },
    { 
      id: 2, 
      type: language === 'es' ? 'Fiebre Aftosa' : language === 'pt' ? 'Febre Aftosa' : 'Foot & Mouth (FMD)', 
      target: language === 'es' ? 'Todo el rodeo' : language === 'pt' ? 'Todo o rebanho' : 'Entire Herd', 
      date: new Date(currentYear, 2, 15),
      displayDate: language === 'es' ? '15 Mar' : language === 'pt' ? '15 Mar' : 'Mar 15',
      status: 'pending' as const 
    },
    { 
      id: 3, 
      type: language === 'es' ? 'Clostridiosis 7 Vías' : language === 'pt' ? 'Clostridiose Polivalente' : 'Clostridial 7-Way', 
      target: language === 'es' ? 'Terneros < 6 meses' : language === 'pt' ? 'Bezerros < 6 meses' : 'Calves < 6 mo', 
      date: new Date(currentYear, 2, 20),
      displayDate: language === 'es' ? '20 Mar' : language === 'pt' ? '20 Mar' : 'Mar 20',
      status: 'pending' as const 
    },
  ];

  const toggleReminder = (id: number) => {
    if (reminders[id]) {
      const newReminders = { ...reminders };
      delete newReminders[id];
      setReminders(newReminders);
    } else {
      setReminderModal({ isOpen: true, itemId: id });
    }
  };

  const saveReminder = () => {
    if (reminderModal.itemId !== null) {
      setReminders({
        ...reminders,
        [reminderModal.itemId]: selectedReminderOption
      });
      setReminderModal({ isOpen: false, itemId: null });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.san_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t.san_subtitle}</p>
        </div>
        <button 
          onClick={() => startListening('Health & Sanitary')}
          className={`flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 cursor-pointer ${
            isListening 
              ? 'bg-red-500 text-white animate-pulse' 
              : 'bg-orange-600 text-white hover:bg-orange-700'
          }`}
        >
          <Mic size={28} />
          {isListening ? (language === 'es' ? 'Escuchando...' : language === 'pt' ? 'Ouvindo...' : 'Listening...') : t.san_voice_btn}
        </button>
      </header>

      {/* Processing Feedback */}
      {processing && (
        <div className="bg-blue-50 dark:bg-blue-950/40 p-4 rounded-xl border border-blue-200 dark:border-blue-800 flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-800 dark:text-blue-300 font-medium">
            {language === 'es' ? 'Procesando comando de voz veterinario con IA...' : language === 'pt' ? 'Processando comando sanitário com IA...' : 'Processing voice command with AI...'}
          </p>
        </div>
      )}

      {/* Last Entry Result */}
      {voiceResult && !processing && (
        <div className="bg-green-50 dark:bg-green-950/40 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 className="text-green-600 dark:text-green-400" />
            <h3 className="font-bold text-green-900 dark:text-green-300">
              {language === 'es' ? 'Registro Sanitario Guardado con Éxito' : language === 'pt' ? 'Registro Sanitário Processado com Sucesso' : 'Record Processed Successfully'}
            </h3>
          </div>
          <pre className="text-sm text-green-800 dark:text-green-300 overflow-x-auto bg-green-100/50 dark:bg-green-900/30 p-2 rounded">
            {voiceResult}
          </pre>
        </div>
      )}

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center gap-3 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all cursor-pointer">
          <QrCode size={40} className="text-stone-600 dark:text-stone-400" />
          <span className="font-bold text-stone-700 dark:text-stone-300">{t.san_scan_eartag}</span>
        </button>
        <button className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center gap-3 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all cursor-pointer">
          <Syringe size={40} className="text-stone-600 dark:text-stone-400" />
          <span className="font-bold text-stone-700 dark:text-stone-300">{t.san_new_vaccine}</span>
        </button>
        <button className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center gap-3 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all cursor-pointer">
          <Calendar size={40} className="text-stone-600 dark:text-stone-400" />
          <span className="font-bold text-stone-700 dark:text-stone-300">{t.san_schedule}</span>
        </button>
        <button className="p-6 bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800 rounded-2xl flex flex-col items-center gap-3 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all cursor-pointer">
          <AlertCircle size={40} className="text-stone-600 dark:text-stone-400" />
          <span className="font-bold text-stone-700 dark:text-stone-300">{t.san_withholding}</span>
        </button>
      </div>

      {/* Health Metrics Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vaccination Rate */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
          <h3 className="font-bold text-lg text-stone-800 dark:text-white mb-4">{t.san_rate_title}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={vaccinationData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {vaccinationData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {vaccinationData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-stone-600 dark:text-stone-400 font-medium">{item.name} ({Math.round(item.value / 10)}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disease Incidence */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800">
          <h3 className="font-bold text-lg text-stone-800 dark:text-white mb-4">{t.san_disease_title}</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={diseaseData}>
                <XAxis dataKey="name" tick={{fontSize: 12}} stroke="#888888" />
                <YAxis stroke="#888888" />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="cases" fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Mortality Rate */}
        <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-lg text-stone-800 dark:text-white mb-2">{t.san_mortality_title}</h3>
            <p className="text-stone-500 dark:text-stone-400 text-sm">{t.san_mortality_sub}</p>
          </div>
          
          <div className="flex items-end gap-2 my-6">
            <span className="text-5xl font-bold text-stone-900 dark:text-white">1.2%</span>
            <span className="text-green-500 font-bold mb-2 flex items-center text-sm">
              -0.3% <span className="text-stone-400 font-normal ml-1">{language === 'es' ? 'vs año anterior' : language === 'pt' ? 'vs ano anterior' : 'vs previous year'}</span>
            </span>
          </div>

          <div className="space-y-3">
            <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl flex justify-between items-center">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                {language === 'es' ? 'Terneros / Cría' : language === 'pt' ? 'Bezerros' : 'Calves'}
              </span>
              <span className="font-bold text-stone-900 dark:text-white">0.8%</span>
            </div>
            <div className="bg-stone-50 dark:bg-stone-800/60 p-3 rounded-xl flex justify-between items-center">
              <span className="text-sm text-stone-600 dark:text-stone-400">
                {language === 'es' ? 'Bovinos Adultos' : language === 'pt' ? 'Bovinos Adultos' : 'Adult Cattle'}
              </span>
              <span className="font-bold text-stone-900 dark:text-white">0.4%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Withdrawal Period Control Section */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden mt-6">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800 flex justify-between items-center">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <AlertCircle className="text-orange-500" />
            {t.san_withdrawal_title}
          </h3>
          <span className="text-xs font-bold bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-1 rounded">
            {t.san_updated_today}
          </span>
        </div>
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {[
            { id: 101, animal: language === 'es' ? 'Novillo #552' : language === 'pt' ? 'Novilho #552' : 'Steer #552', medication: 'Ivermectin Pour-On', date: '2026-02-20', withdrawalDays: 28, type: language === 'es' ? 'Carne' : language === 'pt' ? 'Corte' : 'Beef' },
            { id: 102, animal: language === 'es' ? 'Vaca #103' : language === 'pt' ? 'Vaca #103' : 'Cow #103', medication: 'Cephapirin (Mastitis)', date: '2026-02-25', withdrawalDays: 4, type: language === 'es' ? 'Leche' : language === 'pt' ? 'Leite' : 'Dairy' },
            { id: 103, animal: language === 'es' ? 'Ternero #88' : language === 'pt' ? 'Bezerro #88' : 'Calf #88', medication: 'ADE Vitamin Complex', date: '2026-01-10', withdrawalDays: 0, type: language === 'es' ? 'Carne' : language === 'pt' ? 'Corte' : 'Beef' },
            { id: 104, animal: language === 'es' ? 'Toro #771' : language === 'pt' ? 'Touro #771' : 'Bull #771', medication: 'Permethrin Ectoparasiticide', date: '2026-02-10', withdrawalDays: 14, type: language === 'es' ? 'Carne' : language === 'pt' ? 'Corte' : 'Beef' },
          ].map((item) => {
            const today = new Date();
            const medDate = new Date(item.date);
            const releaseDate = new Date(medDate);
            releaseDate.setDate(medDate.getDate() + item.withdrawalDays);
            
            const daysLeft = Math.ceil((releaseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            const isBlocked = daysLeft > 0;
            const locale = language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US';

            return (
              <div key={item.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50 gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${
                    isBlocked ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                  }`}>
                    {item.animal.split(' ')[1] || item.animal}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{item.animal} <span className="text-xs font-normal text-stone-500 dark:text-stone-400">({item.type})</span></h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">
                      {item.medication} • {new Date(item.date).toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-xs text-stone-400 uppercase font-bold">{language === 'es' ? 'Estado' : language === 'pt' ? 'Status' : 'Status'}</p>
                    {isBlocked ? (
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                        <AlertCircle size={16} />
                        <span>{t.san_status_blocked} ({daysLeft} {language === 'es' ? 'días' : language === 'pt' ? 'dias' : 'days'})</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-bold">
                        <CheckCircle2 size={16} />
                        <span>{t.san_status_cleared}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-right hidden sm:block">
                     <p className="text-xs text-stone-400 uppercase font-bold">{t.san_clearance_date}</p>
                     <p className="font-medium text-stone-700 dark:text-stone-300">
                       {releaseDate.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' })}
                     </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Reminder Modal */}
      {reminderModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-xl text-stone-900 dark:text-white flex items-center gap-2">
                <BellRing className="text-orange-600" />
                {language === 'es' ? 'Configurar Alerta de Vacunación' : language === 'pt' ? 'Configurar Alerta de Vacina' : 'Configure Vaccine Alert'}
              </h3>
              <button 
                onClick={() => setReminderModal({ isOpen: false, itemId: null })}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>
            
            <p className="text-stone-600 dark:text-stone-300 mb-4 text-sm">
              {language === 'es' 
                ? '¿Con cuánta anticipación desea recibir las notificaciones para este tratamiento?' 
                : language === 'pt' 
                  ? 'Com quanto tempo de antecedência deseja ser lembrado desta vacina?' 
                  : 'When would you like to receive notification reminders for this treatment?'}
            </p>

            <div className="space-y-2 mb-6">
              {[
                { label: language === 'es' ? 'El mismo día programado' : language === 'pt' ? 'No dia agendado' : 'On the scheduled day', val: 'On the scheduled day' },
                { label: language === 'es' ? '1 día antes' : language === 'pt' ? '1 dia antes' : '1 day before', val: '1 day before' },
                { label: language === 'es' ? '3 días antes' : language === 'pt' ? '3 dias antes' : '3 days before', val: '3 days before' },
                { label: language === 'es' ? '1 semana antes' : language === 'pt' ? '1 semana antes' : '1 week before', val: '1 week before' }
              ].map((option) => (
                <button
                  key={option.val}
                  onClick={() => setSelectedReminderOption(option.val)}
                  className={`w-full p-3 rounded-xl text-left font-medium transition-all cursor-pointer ${
                    selectedReminderOption === option.val
                      ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-2 border-orange-500'
                      : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-2 border-transparent hover:bg-stone-100 dark:hover:bg-stone-700'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <button
              onClick={saveReminder}
              className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold py-3 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors cursor-pointer"
            >
              {language === 'es' ? 'Guardar Programación de Alerta' : language === 'pt' ? 'Salvar Alerta' : 'Save Alert Schedule'}
            </button>
          </div>
        </div>
      )}

      {/* Vaccination Status List & Calendar */}
      <section className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-100 dark:border-stone-800">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white">{t.san_upcoming_protocol}</h3>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
          {/* List View */}
          <div className="divide-y divide-stone-100 dark:divide-stone-800 border border-stone-200 dark:border-stone-800 rounded-xl overflow-hidden">
            {upcomingVaccinations.map((item) => (
              <div key={item.id} className="p-4 flex items-center justify-between hover:bg-stone-50 dark:hover:bg-stone-800/50">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${item.status === 'urgent' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{item.type}</h4>
                    <p className="text-sm text-stone-500 dark:text-stone-400">{item.target}</p>
                    {reminders[item.id] && (
                      <div className="flex items-center gap-1 mt-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                        <Clock size={12} />
                        <span>Reminder: {reminders[item.id]}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`font-bold ${item.status === 'urgent' ? 'text-red-600 dark:text-red-400' : 'text-stone-600 dark:text-stone-400'}`}>
                      {item.displayDate}
                    </span>
                  </div>
                  <button 
                    onClick={() => toggleReminder(item.id)}
                    className={`p-2 rounded-full transition-colors cursor-pointer ${
                      reminders[item.id] 
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' 
                        : 'text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-stone-600 dark:hover:text-stone-200'
                    }`}
                    title={reminders[item.id] ? "Remove reminder" : "Add reminder"}
                  >
                    {reminders[item.id] ? <BellRing size={20} /> : <Bell size={20} />}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Calendar View */}
          <div>
            <MiniCalendar vaccinations={upcomingVaccinations} reminders={reminders} />
          </div>
        </div>
      </section>
    </div>
  );
}

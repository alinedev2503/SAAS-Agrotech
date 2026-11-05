import { useState } from 'react';
import { ChevronLeft, ChevronRight, BellRing } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Vaccination {
  id: number;
  type: string;
  target: string;
  date: Date;
  status: 'urgent' | 'pending' | 'completed';
}

interface MiniCalendarProps {
  vaccinations: Vaccination[];
  reminders: Record<number, string>;
}

export default function MiniCalendar({ vaccinations, reminders }: MiniCalendarProps) {
  const { language } = useLanguage();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = {
    es: [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ],
    en: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    pt: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]
  };

  const dayHeaders = {
    es: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
    en: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    pt: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
  };

  const currentMonths = monthNames[language] || monthNames.es;
  const currentDayHeaders = dayHeaders[language] || dayHeaders.es;
  const dateLocale = language === 'es' ? 'es-ES' : language === 'pt' ? 'pt-BR' : 'en-US';

  const renderDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const startDay = firstDayOfMonth(currentDate);

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10 w-10" />);
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      
      // Check for vaccinations on this day
      const dayVaccinations = vaccinations.filter(v => 
        v.date.getDate() === day && 
        v.date.getMonth() === currentDate.getMonth() && 
        v.date.getFullYear() === currentDate.getFullYear()
      );

      const hasReminder = dayVaccinations.some(v => reminders[v.id]);
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div key={day} className="h-10 w-10 flex items-center justify-center relative group">
          <div 
            className={`
              w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors
              ${isToday ? 'bg-stone-900 text-white dark:bg-white dark:text-stone-900' : 'text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800'}
              ${dayVaccinations.length > 0 && !isToday ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 font-bold' : ''}
            `}
          >
            {day}
          </div>
          
          {/* Indicators */}
          <div className="absolute bottom-1 flex gap-0.5">
            {dayVaccinations.map((v, i) => (
              <div 
                key={i} 
                className={`w-1 h-1 rounded-full ${reminders[v.id] ? 'bg-orange-500' : 'bg-stone-400'}`} 
              />
            ))}
          </div>

          {/* Tooltip */}
          {dayVaccinations.length > 0 && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-white dark:bg-stone-800 p-3 rounded-xl shadow-xl border border-stone-200 dark:border-stone-700 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              <p className="text-xs font-bold text-stone-500 dark:text-stone-400 mb-1">
                {date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
              <div className="space-y-2">
                {dayVaccinations.map(v => (
                  <div key={v.id} className="flex items-start gap-2">
                    <div className={`w-2 h-2 mt-1 rounded-full ${v.status === 'urgent' ? 'bg-red-500' : 'bg-yellow-500'}`} />
                    <div>
                      <p className="text-xs font-bold text-stone-900 dark:text-white">{v.type}</p>
                      <p className="text-[10px] text-stone-500 dark:text-stone-400">{v.target}</p>
                      {reminders[v.id] && (
                        <div className="flex items-center gap-1 mt-0.5 text-[10px] font-bold text-orange-600 dark:text-orange-400">
                          <BellRing size={10} />
                          <span>
                            {language === 'es' ? 'Recordatorio activo' : language === 'pt' ? 'Lembrete ativo' : 'Reminder active'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-stone-50 dark:bg-stone-800/50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-bold text-stone-900 dark:text-white capitalize">
          {currentMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h4>
        <div className="flex gap-1">
          <button 
            onClick={prevMonth} 
            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer" 
            title={language === 'es' ? 'Mes anterior' : language === 'pt' ? 'Mês anterior' : 'Previous Month'}
          >
            <ChevronLeft size={20} className="text-stone-600 dark:text-stone-400" />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-1 hover:bg-stone-200 dark:hover:bg-stone-700 rounded-lg transition-colors cursor-pointer" 
            title={language === 'es' ? 'Mes siguiente' : language === 'pt' ? 'Próximo mês' : 'Next Month'}
          >
            <ChevronRight size={20} className="text-stone-600 dark:text-stone-400" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {currentDayHeaders.map((day, i) => (
          <div key={i} className="h-8 flex items-center justify-center text-xs font-bold text-stone-400">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {renderDays()}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs text-stone-500 dark:text-stone-400 px-2">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-orange-500" />
          <span>
            {language === 'es' ? 'Con Recordatorio' : language === 'pt' ? 'Com Lembrete' : 'With Reminder'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-stone-400" />
          <span>
            {language === 'es' ? 'Sin Recordatorio' : language === 'pt' ? 'Sem Lembrete' : 'No Reminder'}
          </span>
        </div>
      </div>
    </div>
  );
}

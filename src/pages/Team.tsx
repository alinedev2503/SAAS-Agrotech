import { useState } from 'react';
import { Users, CheckSquare, Clock, Plus, X, UserCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface TeamMember {
  name: string;
  roleKey: 'foreman' | 'operator' | 'handler' | 'vet';
  status: 'online' | 'busy' | 'offline';
  initials: string;
}

interface TaskItem {
  id: number;
  titleKey?: string;
  titleFallback?: string;
  assignee: string;
  descKey?: string;
  descFallback?: string;
  status: 'in_progress' | 'pending' | 'completed';
  timeKey: string;
}

export default function Team() {
  const { language, t } = useLanguage();
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 1,
      titleFallback: language === 'es' ? 'Reparación de Alambrado Perimetral - Potrero 03' : language === 'pt' ? 'Reparo da Cerca Perimetral - Piquete 03' : 'Fence Perimeter Repair - Pasture 03',
      assignee: 'John Miller',
      descFallback: language === 'es' ? 'Reemplazar 3 postes de quebracho rotos y retensar alambre de alta resistencia. Comprobar voltaje del electrificador solar.' : language === 'pt' ? 'Substituir 3 mourões quebrados e esticar arame liso. Verificar voltagem do eletrificador solar.' : 'Replace 3 broken cedar posts and re-tension high-tensile wire. Verify solar energizer grounding rod voltage.',
      status: 'in_progress',
      timeKey: language === 'es' ? 'Iniciado hace 2h' : language === 'pt' ? 'Iniciado há 2h' : 'Started 2h ago'
    },
    {
      id: 2,
      titleFallback: language === 'es' ? 'Reposición de Batea de Sal Mineral' : language === 'pt' ? 'Reposição de Sal Mineral no Cocho' : 'Mineral Salt Trough Replenishment',
      assignee: 'Marcus Vance',
      descFallback: language === 'es' ? 'Distribuir bolsas de sales minerales altas en fósforo en los comederos de los corrales A y B.' : language === 'pt' ? 'Distribuir sacos de sal mineral de alta concentração fosfórica nos cochos dos lotes A e B.' : 'Distribute 50lb high-phosphorus mineral bags to Pen A and Pen B troughs.',
      status: 'pending',
      timeKey: language === 'es' ? 'Vence hoy 16:00' : language === 'pt' ? 'Prazo hoje 16:00' : 'Due by 4:00 PM'
    },
    {
      id: 3,
      titleFallback: language === 'es' ? 'Mantenimiento de Cosechadora (250 horas)' : language === 'pt' ? 'Revisão da Colheitadeira (250 horas)' : 'Combine Harvester 250hr Maintenance',
      assignee: 'Peter Jenkins',
      descFallback: language === 'es' ? 'Cambio de aceite de motor y filtros, revisión de fluido hidrostático y engrase de rodamientos de plataforma.' : language === 'pt' ? 'Troca de óleo do motor e filtros, verificação do fluido hidrostático e lubrificação da plataforma.' : 'Replaced engine oil and filters, checked hydrostatic fluid levels, and greased header bearings.',
      status: 'completed',
      timeKey: language === 'es' ? 'Completado ayer' : language === 'pt' ? 'Concluído ontem' : 'Completed yesterday'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('John Miller');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const members: TeamMember[] = [
    { name: 'John Miller', roleKey: 'foreman', status: 'online', initials: 'JM' },
    { name: 'Peter Jenkins', roleKey: 'operator', status: 'busy', initials: 'PJ' },
    { name: 'Marcus Vance', roleKey: 'handler', status: 'offline', initials: 'MV' },
    { name: 'Dr. Sarah Hayes', roleKey: 'vet', status: 'online', initials: 'SH' },
  ];

  const getRoleLabel = (key: TeamMember['roleKey']) => {
    switch (key) {
      case 'foreman':
        return language === 'es' ? 'Capataz de Campo' : language === 'pt' ? 'Capataz de Campo' : 'Farm Foreman';
      case 'operator':
        return language === 'es' ? 'Operador de Maquinaria' : language === 'pt' ? 'Operador de Máquinas' : 'Equipment Operator';
      case 'handler':
        return language === 'es' ? 'Peón de Ganadería' : language === 'pt' ? 'Manejador de Rebanho' : 'Livestock Handler';
      case 'vet':
        return language === 'es' ? 'Consultora Veterinaria' : language === 'pt' ? 'Consultora Veterinária' : 'Veterinary Consultant';
    }
  };

  const getStatusLabel = (status: TaskItem['status']) => {
    switch (status) {
      case 'completed':
        return language === 'es' ? 'Completada' : language === 'pt' ? 'Concluída' : 'Completed';
      case 'in_progress':
        return language === 'es' ? 'En Progreso' : language === 'pt' ? 'Em Andamento' : 'In Progress';
      case 'pending':
        return language === 'es' ? 'Pendiente' : language === 'pt' ? 'Pendente' : 'Pending';
    }
  };

  const getMemberStatusLabel = (status: TeamMember['status']) => {
    switch (status) {
      case 'online':
        return language === 'es' ? 'En línea' : language === 'pt' ? 'Online' : 'Online';
      case 'busy':
        return language === 'es' ? 'Ocupado' : language === 'pt' ? 'Ocupado' : 'Busy';
      case 'offline':
        return language === 'es' ? 'Desconectado' : language === 'pt' ? 'Offline' : 'Offline';
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now(),
      titleFallback: newTaskTitle,
      assignee: newTaskAssignee,
      descFallback: newTaskDesc || (language === 'es' ? 'Tarea operativa asignada en campo.' : language === 'pt' ? 'Tarefa operacional de campo.' : 'Routine agricultural field task.'),
      status: 'pending',
      timeKey: language === 'es' ? 'Recién asignada' : language === 'pt' ? 'Recém-atribuída' : 'Just assigned'
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.team_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t.team_subtitle}</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2.5 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 flex items-center gap-2 font-bold text-sm shadow-sm transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus size={18} />
          <span>{t.team_new_work_order}</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-bold text-stone-700 dark:text-stone-300 uppercase text-xs tracking-wider flex items-center gap-2">
            <Users size={16} />
            {t.team_active_crew} ({members.length})
          </h3>
          <div className="space-y-3">
            {members.map((member, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-xs border border-stone-200 dark:border-stone-800 flex items-center gap-3 cursor-pointer hover:border-orange-500 transition-colors">
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 dark:text-white truncate">{member.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{getRoleLabel(member.roleKey)}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' : 
                    member.status === 'busy' ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'
                  }`} />
                  <span className="text-[10px] text-stone-400 capitalize">{getMemberStatusLabel(member.status)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tasks */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-700 dark:text-stone-300 uppercase text-xs tracking-wider">
              {t.team_tasks_title}
            </h3>
            <span className="text-xs text-stone-400">{tasks.length} {language === 'es' ? 'Total' : language === 'pt' ? 'Total' : 'Total'}</span>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border transition-all ${
                  task.status === 'completed' 
                    ? 'border-stone-200 dark:border-stone-800 opacity-80' 
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      task.status === 'completed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : task.status === 'in_progress' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}>
                      <CheckSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-stone-900 dark:text-white">{task.titleFallback}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                        <UserCheck size={13} />
                        {language === 'es' ? 'Asignado a' : language === 'pt' ? 'Atribuído a' : 'Assigned to'}: <span className="font-medium text-stone-700 dark:text-stone-300">{task.assignee}</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    task.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : task.status === 'in_progress'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {getStatusLabel(task.status)}
                  </span>
                </div>
                
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 pl-11">
                  {task.descFallback}
                </p>
                
                <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3 pl-11">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{task.timeKey}</span>
                  </div>
                  {task.status !== 'completed' && (
                    <button 
                      onClick={() => {
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'completed' } : t));
                      }}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      {t.team_mark_done}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-2xl p-6 w-full max-w-lg shadow-2xl border border-stone-200 dark:border-stone-800">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-xl text-stone-900 dark:text-white">{t.team_create_modal_title}</h3>
              <button 
                onClick={() => setIsTaskModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                  {t.team_task_title}
                </label>
                <input 
                  type="text" 
                  required
                  placeholder={language === 'es' ? 'ej. Inspeccionar Picos de Pivote Central' : language === 'pt' ? 'ex. Inspecionar Bicos do Pivô Central' : 'e.g. Inspect Center-Pivot Nozzles'}
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                  {t.team_assign_crew}
                </label>
                <select 
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {members.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({getRoleLabel(m.roleKey)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                  {t.team_instructions}
                </label>
                <textarea 
                  rows={3}
                  placeholder={language === 'es' ? 'Describir herramientas necesarias, ubicación, notas de seguridad...' : language === 'pt' ? 'Descrever ferramentas necessárias, local, notas de segurança...' : 'Describe tools required, locations, safety notes...'}
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-300 font-bold text-sm hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer"
                >
                  {t.team_cancel}
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark cursor-pointer shadow-sm"
                >
                  {t.team_dispatch}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

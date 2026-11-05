import { useState } from 'react';
import { Users, CheckSquare, Clock, Plus, X, UserCheck, AlertCircle } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  status: 'online' | 'busy' | 'offline';
  initials: string;
}

interface TaskItem {
  id: number;
  title: string;
  assignee: string;
  description: string;
  status: 'In Progress' | 'Pending' | 'Completed';
  timeLabel: string;
}

export default function Team() {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [tasks, setTasks] = useState<TaskItem[]>([
    {
      id: 1,
      title: 'Fence Perimeter Repair - Pasture 03',
      assignee: 'John Miller',
      description: 'Replace 3 broken cedar posts and re-tension high-tensile wire. Verify solar energizer grounding rod voltage.',
      status: 'In Progress',
      timeLabel: 'Started 2h ago'
    },
    {
      id: 2,
      title: 'Mineral Salt Trough Replenishment',
      assignee: 'Marcus Vance',
      description: 'Distribute 50lb high-phosphorus mineral bags to Pen A and Pen B troughs.',
      status: 'Pending',
      timeLabel: 'Due by 4:00 PM'
    },
    {
      id: 3,
      title: 'Combine Harvester 250hr Maintenance',
      assignee: 'Peter Jenkins',
      description: 'Replaced engine oil and filters, checked hydrostatic fluid levels, and greased header bearings.',
      status: 'Completed',
      timeLabel: 'Completed yesterday'
    }
  ]);

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('John Miller');
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const members: TeamMember[] = [
    { name: 'John Miller', role: 'Farm Foreman', status: 'online', initials: 'JM' },
    { name: 'Peter Jenkins', role: 'Equipment Operator', status: 'busy', initials: 'PJ' },
    { name: 'Marcus Vance', role: 'Livestock Handler', status: 'offline', initials: 'MV' },
    { name: 'Dr. Sarah Hayes', role: 'Veterinary Consultant', status: 'online', initials: 'SH' },
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: TaskItem = {
      id: Date.now(),
      title: newTaskTitle,
      assignee: newTaskAssignee,
      description: newTaskDesc || 'Routine agricultural maintenance task.',
      status: 'Pending',
      timeLabel: 'Just assigned'
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle('');
    setNewTaskDesc('');
    setIsTaskModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Team & Field Operations</h2>
          <p className="text-stone-500 dark:text-stone-400">Labor allocation, operational work orders, and field productivity.</p>
        </div>
        <button 
          onClick={() => setIsTaskModalOpen(true)}
          className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2.5 rounded-xl hover:bg-stone-800 dark:hover:bg-stone-200 flex items-center gap-2 font-bold text-sm shadow-sm transition-colors cursor-pointer"
        >
          <Plus size={18} />
          <span>New Work Order</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team List */}
        <div className="md:col-span-1 space-y-4">
          <h3 className="font-bold text-stone-700 dark:text-stone-300 uppercase text-xs tracking-wider flex items-center gap-2">
            <Users size={16} />
            Active Crew ({members.length})
          </h3>
          <div className="space-y-3">
            {members.map((member, idx) => (
              <div key={idx} className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-xs border border-stone-200 dark:border-stone-800 flex items-center gap-3 cursor-pointer hover:border-orange-500 transition-colors">
                <div className="w-10 h-10 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center font-bold text-stone-700 dark:text-stone-200 border border-stone-200 dark:border-stone-700">
                  {member.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-stone-900 dark:text-white truncate">{member.name}</h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400">{member.role}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full ${
                    member.status === 'online' ? 'bg-green-500' : 
                    member.status === 'busy' ? 'bg-amber-500' : 'bg-stone-300 dark:bg-stone-600'
                  }`} />
                  <span className="text-[10px] text-stone-400 capitalize">{member.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Tasks */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-stone-700 dark:text-stone-300 uppercase text-xs tracking-wider">
              Field Work Orders & Tasks
            </h3>
            <span className="text-xs text-stone-400">{tasks.length} Total</span>
          </div>
          
          <div className="space-y-4">
            {tasks.map((task) => (
              <div 
                key={task.id} 
                className={`bg-white dark:bg-stone-900 p-6 rounded-2xl shadow-xs border transition-all ${
                  task.status === 'Completed' 
                    ? 'border-stone-200 dark:border-stone-800 opacity-80' 
                    : 'border-stone-200 dark:border-stone-800 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex justify-between items-start mb-3 gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      task.status === 'Completed' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : task.status === 'In Progress' 
                          ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' 
                          : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}>
                      <CheckSquare size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-base text-stone-900 dark:text-white">{task.title}</h4>
                      <p className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1 mt-0.5">
                        <UserCheck size={13} />
                        Assigned to: <span className="font-medium text-stone-700 dark:text-stone-300">{task.assignee}</span>
                      </p>
                    </div>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                    task.status === 'Completed'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : task.status === 'In Progress'
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                  }`}>
                    {task.status}
                  </span>
                </div>
                
                <p className="text-sm text-stone-600 dark:text-stone-300 mb-4 pl-11">
                  {task.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-stone-400 border-t border-stone-100 dark:border-stone-800 pt-3 pl-11">
                  <div className="flex items-center gap-1.5">
                    <Clock size={14} />
                    <span>{task.timeLabel}</span>
                  </div>
                  {task.status !== 'Completed' && (
                    <button 
                      onClick={() => {
                        setTasks(tasks.map(t => t.id === task.id ? { ...t, status: 'Completed' } : t));
                      }}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Mark as Done
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
              <h3 className="font-bold text-xl text-stone-900 dark:text-white">Create Work Order</h3>
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
                  Task Title
                </label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Inspect Center-Pivot Nozzles"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                  Assign To Crew Member
                </label>
                <select 
                  value={newTaskAssignee}
                  onChange={(e) => setNewTaskAssignee(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {members.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 dark:text-stone-400 mb-1">
                  Detailed Instructions
                </label>
                <textarea 
                  rows={3}
                  placeholder="Describe tools required, locations, safety notes..."
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
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-dark cursor-pointer shadow-sm"
                >
                  Dispatch Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Beef, Plus, X, Search, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { databaseService } from '../infrastructure/config/baas';
import { useLanguage } from '../contexts/LanguageContext';
import { SuccessToast } from '../components/SuccessToast';

interface Lot {
  id: string;
  name: string;
  species: string;
  quantity: number;
}

interface Animal {
  id: string;
  tag: string;
  name: string;
  species: string;
  breed: string;
  birth_date: string;
  weight: number;
  status: string;
  lot_id: string | null;
}

export default function Animals() {
  const { language, t } = useLanguage();
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [showAddLot, setShowAddLot] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const [animalForm, setAnimalForm] = useState({
    tag: '', name: '', species: 'cattle', breed: '', birth_date: '', weight: '', lot_id: ''
  });
  const [lotForm, setLotForm] = useState({
    name: '', species: 'cattle', quantity: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedAnimals, fetchedLots] = await Promise.all([
        databaseService.list<Animal>('animals'),
        databaseService.list<Lot>('lots')
      ]);
      setAnimals(fetchedAnimals || []);
      setLots(fetchedLots || []);
    } catch {
      setError(language === 'es' ? 'Error al cargar registros del rodeo.' : language === 'pt' ? 'Erro ao carregar registros do rebanho.' : 'Failed to load livestock database records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...animalForm,
        weight: parseFloat(animalForm.weight) || 0,
        lot_id: animalForm.lot_id ? animalForm.lot_id : null,
      };
      await databaseService.create<Animal>('animals', payload);
      setShowAddAnimal(false);
      setAnimalForm({ tag: '', name: '', species: 'cattle', breed: '', birth_date: '', weight: '', lot_id: '' });
      showToast(language === 'es' ? 'Animal registrado exitosamente.' : language === 'pt' ? 'Animal registrado com sucesso.' : 'Animal registered successfully.');
      await fetchData();
    } catch {
      setError('Error creating animal record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await databaseService.create<Lot>('lots', { ...lotForm, quantity: parseInt(lotForm.quantity) || 0 });
      setShowAddLot(false);
      setLotForm({ name: '', species: 'cattle', quantity: '' });
      showToast(language === 'es' ? 'Lote creado exitosamente.' : language === 'pt' ? 'Lote criado com sucesso.' : 'Lot created successfully.');
      await fetchData();
    } catch {
      setError('Error creating lot record.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await databaseService.update<Animal>('animals', id, { status });
      await fetchData();
    } catch {
      setError('Failed to update animal status.');
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    try {
      await databaseService.delete('animals', id);
      await fetchData();
    } catch {
      setError('Failed to remove animal record.');
    }
  };

  const speciesList = ['cattle', 'swine', 'sheep', 'goats', 'equine'];
  
  const speciesLabels: Record<string, string> = {
    cattle: language === 'es' ? 'Bovino' : language === 'pt' ? 'Bovino' : 'Cattle',
    swine: language === 'es' ? 'Porcino' : language === 'pt' ? 'Suíno' : 'Swine',
    sheep: language === 'es' ? 'Ovino' : language === 'pt' ? 'Ovino' : 'Sheep',
    goats: language === 'es' ? 'Caprino' : language === 'pt' ? 'Caprino' : 'Goats',
    equine: language === 'es' ? 'Equino' : language === 'pt' ? 'Equino' : 'Equine',
    bovino: language === 'es' ? 'Bovino' : language === 'pt' ? 'Bovino' : 'Cattle',
    suíno: language === 'es' ? 'Porcino' : language === 'pt' ? 'Suíno' : 'Swine',
    ovino: language === 'es' ? 'Ovino' : language === 'pt' ? 'Ovino' : 'Sheep',
    caprino: language === 'es' ? 'Caprino' : language === 'pt' ? 'Caprino' : 'Goats',
  };

  const speciesColors: Record<string, string> = {
    cattle: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    bovino: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    swine: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    suíno: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    sheep: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    ovino: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    goats: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    caprino: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    equine: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    ativo: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    sold: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
    quarentena: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    quarantined: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    tratamento: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    treatment: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    deceased: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };

  const getSpeciesCount = (species: string) =>
    animals.filter(a => (a.status === 'active' || a.status === 'ativo') && (a.species === species || (species === 'cattle' && a.species === 'bovino'))).length;

  const filteredAnimals = animals.filter(a =>
    a.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.species?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.breed?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SuccessToast message={toastMessage} onClose={() => setToastMessage(null)} />
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">{t.anim_title}</h2>
          <p className="text-stone-500 dark:text-stone-400">{t.anim_subtitle}</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddLot(true)}
            className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-2 rounded-xl font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Beef size={20} />
            <span className="hidden sm:inline">{t.anim_new_lot}</span>
          </button>
          <button
            onClick={() => setShowAddAnimal(true)}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">{t.anim_new_animal}</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-red-700 dark:text-red-300 text-sm font-medium">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 dark:text-red-400 font-bold text-sm hover:underline cursor-pointer">
            {language === 'es' ? 'Reintentar' : language === 'pt' ? 'Tentar novamente' : 'Try again'}
          </button>
        </div>
      )}

      {/* Herd Summary KPI */}
      <section>
        <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-4">
          {language === 'es' ? 'Censo y Clasificación del Rodeo' : language === 'pt' ? 'Censo e Distribuição do Rebanho' : 'Herd Census & Breakdown'}
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speciesList.map(species => {
            const count = getSpeciesCount(species);
            const lotCount = lots.filter(l => l.species === species || (species === 'cattle' && l.species === 'bovino')).length;
            return (
              <div key={species} className="bg-white dark:bg-stone-900 p-4 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">
                    {speciesLabels[species] || species}
                  </span>
                </div>
                <p className="text-3xl font-bold text-stone-900 dark:text-white">{count}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">
                  {lotCount} {language === 'es' ? (lotCount === 1 ? 'corral' : 'corrales') : language === 'pt' ? (lotCount === 1 ? 'piquete' : 'piquetes') : (lotCount === 1 ? 'pen' : 'pens')}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Pasture Lots */}
      {lots.length > 0 && (
        <section>
          <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-4">
            {language === 'es' ? 'Lotes y Corrales de Pastoreo' : language === 'pt' ? 'Piquetes e Currais de Pasto' : 'Pasture Lots & Pens'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lots.map(lot => {
              const currentOccupants = animals.filter(a => a.lot_id === lot.id).length;
              return (
                <div key={lot.id} className="bg-white dark:bg-stone-900 p-5 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400 shrink-0">
                      <Beef size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white text-base">{lot.name}</h4>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${speciesColors[lot.species] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
                        {speciesLabels[lot.species] || lot.species}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-stone-500 dark:text-stone-400">
                      {language === 'es' ? 'Capacidad y Ocupación' : language === 'pt' ? 'Capacidade & Lotação' : 'Capacity & Occupancy'}
                    </span>
                    <span className="font-bold text-stone-900 dark:text-white">
                      {currentOccupants} / {lot.quantity} {t.dash_head_count}
                    </span>
                  </div>
                  <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.min(100, (currentOccupants / Math.max(1, lot.quantity)) * 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Animals Registered */}
      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <Beef className="text-orange-500" />
            {language === 'es' ? `Rodeo Registrado (${filteredAnimals.length})` : language === 'pt' ? `Animais Registrados (${filteredAnimals.length})` : `Registered Livestock (${filteredAnimals.length})`}
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder={t.anim_search_placeholder}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-800 overflow-hidden">
          {filteredAnimals.length === 0 ? (
            <div className="p-12 text-center">
              <Beef size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium">
                {searchQuery 
                  ? (language === 'es' ? 'No se encontraron animales con ese criterio.' : language === 'pt' ? 'Nenhum animal encontrado.' : 'No matching livestock found.') 
                  : (language === 'es' ? 'No hay animales registrados aún. Haga clic en "Registrar Animal".' : language === 'pt' ? 'Nenhum animal cadastrado ainda.' : 'No livestock registered yet. Click "Register Animal" to start.')}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 dark:text-stone-400 uppercase bg-stone-50 dark:bg-stone-800/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">{t.anim_th_eartag}</th>
                    <th className="px-4 py-3">{language === 'es' ? 'ID / Nombre' : language === 'pt' ? 'Nome / Identificação' : 'Animal ID / Name'}</th>
                    <th className="px-4 py-3">{t.anim_species}</th>
                    <th className="px-4 py-3">{t.anim_breed}</th>
                    <th className="px-4 py-3 text-right">{t.anim_th_weight}</th>
                    <th className="px-4 py-3">{t.anim_th_status}</th>
                    <th className="px-4 py-3 rounded-r-lg text-right">{t.anim_th_actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredAnimals.map(animal => (
                    <tr key={animal.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-mono font-bold text-stone-900 dark:text-white px-2 py-0.5 bg-stone-100 dark:bg-stone-800 rounded-md">
                          {animal.tag}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-stone-900 dark:text-white">{animal.name || '—'}</td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${speciesColors[animal.species] || ''}`}>
                          {speciesLabels[animal.species] || animal.species}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-stone-600 dark:text-stone-400">{animal.breed || '—'}</td>
                      <td className="px-4 py-3.5 text-right font-bold text-stone-900 dark:text-white">
                        {animal.weight ? `${animal.weight.toFixed(1)} kg` : '—'}
                      </td>
                      <td className="px-4 py-3.5">
                        <select
                          value={animal.status}
                          onChange={e => handleStatusChange(animal.id, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold border-0 cursor-pointer outline-none ${statusColors[animal.status] || ''}`}
                        >
                          <option value="active">{language === 'es' ? 'Saludable / Activo' : language === 'pt' ? 'Ativo' : 'Active'}</option>
                          <option value="quarantined">{language === 'es' ? 'En Cuarentena' : language === 'pt' ? 'Quarentena' : 'Quarantined'}</option>
                          <option value="treatment">{language === 'es' ? 'En Tratamiento' : language === 'pt' ? 'Em Tratamento' : 'In Treatment'}</option>
                          <option value="sold">{language === 'es' ? 'Vendido' : language === 'pt' ? 'Vendido' : 'Sold'}</option>
                          <option value="deceased">{language === 'es' ? 'Baja / Muerto' : language === 'pt' ? 'Baixa' : 'Deceased'}</option>
                        </select>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <button
                          onClick={() => handleDeleteAnimal(animal.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1 cursor-pointer"
                          title={language === 'es' ? 'Eliminar Registro' : language === 'pt' ? 'Excluir' : 'Delete Record'}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      {/* Add Animal Modal */}
      <AnimatePresence>
        {showAddAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddAnimal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-800 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
                    <Beef size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">{t.anim_register_title}</h3>
                </div>
                <button onClick={() => setShowAddAnimal(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateAnimal} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_ear_tag} *</label>
                    <input
                      required
                      value={animalForm.tag}
                      onChange={e => setAnimalForm(f => ({ ...f, tag: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="US-1001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                      {language === 'es' ? 'Nombre / Apodo' : language === 'pt' ? 'Nome / Identificação' : 'Name / Identifier'}
                    </label>
                    <input
                      value={animalForm.name}
                      onChange={e => setAnimalForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder={language === 'es' ? 'Campeona' : 'Star Belle'}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_species} *</label>
                    <select
                      required
                      value={animalForm.species}
                      onChange={e => setAnimalForm(f => ({ ...f, species: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      {speciesList.map(s => (
                        <option key={s} value={s}>{speciesLabels[s] || s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_breed}</label>
                    <input
                      value={animalForm.breed}
                      onChange={e => setAnimalForm(f => ({ ...f, breed: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Angus / Hereford"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_weight}</label>
                    <input
                      type="number"
                      step="0.1"
                      value={animalForm.weight}
                      onChange={e => setAnimalForm(f => ({ ...f, weight: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="450"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_birth_date}</label>
                    <input
                      type="date"
                      value={animalForm.birth_date}
                      onChange={e => setAnimalForm(f => ({ ...f, birth_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                    {language === 'es' ? 'Lote / Corral Asignado' : language === 'pt' ? 'Lote / Piquete Atribuído' : 'Assigned Lot / Pen'}
                  </label>
                  <select
                    value={animalForm.lot_id}
                    onChange={e => setAnimalForm(f => ({ ...f, lot_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="">{language === 'es' ? 'Sin lote asignado' : language === 'pt' ? 'Sem lote atribuído' : 'No lot assigned'}</option>
                    {lots.map(lot => (
                      <option key={lot.id} value={lot.id}>{lot.name} ({speciesLabels[lot.species] || lot.species})</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddAnimal(false)}
                    className="w-1/3 py-3 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {t.anim_cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 text-sm shadow-md cursor-pointer"
                  >
                    {submitting ? (language === 'es' ? 'Guardando...' : language === 'pt' ? 'Salvando...' : 'Saving...') : t.anim_save}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Lot Modal */}
      <AnimatePresence>
        {showAddLot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowAddLot(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-3xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-800 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2.5 rounded-xl text-orange-600 dark:text-orange-400">
                    <Beef size={22} />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">
                    {language === 'es' ? 'Crear Lote o Corral' : language === 'pt' ? 'Criar Piquete / Lote' : 'Create Herd Pen / Lot'}
                  </h3>
                </div>
                <button onClick={() => setShowAddLot(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 cursor-pointer">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateLot} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                    {language === 'es' ? 'Nombre del Lote / Corral *' : language === 'pt' ? 'Nome do Lote / Piquete *' : 'Lot / Pen Name *'}
                  </label>
                  <input
                    required
                    value={lotForm.name}
                    onChange={e => setLotForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder={language === 'es' ? 'Corral Engorde A' : 'Feedlot Pen A'}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">{t.anim_species} *</label>
                  <select
                    required
                    value={lotForm.species}
                    onChange={e => setLotForm(f => ({ ...f, species: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {speciesList.map(s => (
                      <option key={s} value={s}>{speciesLabels[s] || s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">
                    {language === 'es' ? 'Capacidad de Cabezas *' : language === 'pt' ? 'Capacidade (Cabeças) *' : 'Head Capacity *'}
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={lotForm.quantity}
                    onChange={e => setLotForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="60"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddLot(false)}
                    className="w-1/3 py-3 border border-stone-200 dark:border-stone-700 rounded-xl font-bold text-sm text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  >
                    {t.anim_cancel}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-2/3 bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50 text-sm shadow-md cursor-pointer"
                  >
                    {submitting ? (language === 'es' ? 'Creando...' : language === 'pt' ? 'Criando...' : 'Creating...') : (language === 'es' ? 'Crear Lote' : language === 'pt' ? 'Criar Lote' : 'Create Herd Lot')}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

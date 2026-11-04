import { useState, useEffect } from 'react';
import { Beef, Plus, X, Search, AlertCircle, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { databaseService } from '../infrastructure/config/baas';

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
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddAnimal, setShowAddAnimal] = useState(false);
  const [showAddLot, setShowAddLot] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [animalForm, setAnimalForm] = useState({
    tag: '', name: '', species: 'bovino', breed: '', birth_date: '', weight: '', lot_id: ''
  });
  const [lotForm, setLotForm] = useState({
    name: '', species: 'bovino', quantity: ''
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
      setError('Erro ao carregar dados do banco de dados.');
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
      setAnimalForm({ tag: '', name: '', species: 'bovino', breed: '', birth_date: '', weight: '', lot_id: '' });
      await fetchData();
    } catch {
      setError('Erro ao criar animal.');
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
      setLotForm({ name: '', species: 'bovino', quantity: '' });
      await fetchData();
    } catch {
      setError('Erro ao criar lote.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await databaseService.update<Animal>('animals', id, { status });
      await fetchData();
    } catch {
      setError('Erro ao atualizar status do animal.');
    }
  };

  const handleDeleteAnimal = async (id: string) => {
    try {
      await databaseService.delete('animals', id);
      await fetchData();
    } catch {
      setError('Erro ao excluir animal.');
    }
  };

  const speciesList = ['bovino', 'suíno', 'ovino', 'caprino', 'equino'];
  const speciesColors: Record<string, string> = {
    bovino: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    suíno: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
    ovino: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    caprino: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    equino: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
  };
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    sold: 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400',
    deceased: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  };
  const getSpeciesCount = (species: string) =>
    animals.filter(a => a.status === 'active' && a.species === species).length;

  const filteredAnimals = animals.filter(a =>
    a.tag?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.species?.toLowerCase().includes(searchQuery.toLowerCase())
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
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-900 dark:text-white">Pecuária & Rebanho</h2>
          <p className="text-stone-500 dark:text-stone-400">Gestão de lotes, animais e desempenho do rebanho.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setShowAddLot(true)}
            className="bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-200 px-4 py-2 rounded-xl font-bold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-700 transition-colors flex items-center gap-2"
          >
            <Beef size={20} />
            <span className="hidden sm:inline">Novo Lote</span>
          </button>
          <button
            onClick={() => setShowAddAnimal(true)}
            className="bg-stone-900 dark:bg-white text-white dark:text-stone-900 px-4 py-2 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Novo Animal</span>
          </button>
        </div>
      </header>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="text-red-500 shrink-0" size={20} />
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <button onClick={fetchData} className="ml-auto text-red-600 dark:text-red-400 font-bold text-sm hover:underline">
            Tentar novamente
          </button>
        </div>
      )}

      <section>
        <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-4">Resumo do Rebanho</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {speciesList.map(species => {
            const count = getSpeciesCount(species);
            const lotCount = lots.filter(l => l.species === species).length;
            return (
              <div key={species} className="bg-white dark:bg-stone-900 p-4 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs uppercase tracking-wider font-bold text-stone-500 dark:text-stone-400">{species}</span>
                </div>
                <p className="text-3xl font-bold text-stone-900 dark:text-white">{count}</p>
                <p className="text-xs text-stone-400 dark:text-stone-500 mt-1">{lotCount} lote{lotCount !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      </section>

      {lots.length > 0 && (
        <section>
          <h3 className="font-bold text-xl text-stone-800 dark:text-white mb-4">Lotes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lots.map(lot => (
              <div key={lot.id} className="bg-white dark:bg-stone-900 p-5 rounded-xl shadow-sm border border-stone-200 dark:border-stone-700">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                    <Beef size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-white">{lot.name}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${speciesColors[lot.species] || 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'}`}>
                      {lot.species}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-stone-500 dark:text-stone-400">Capacidade</span>
                  <span className="font-bold text-stone-900 dark:text-white">{lot.quantity} animais</span>
                </div>
                <div className="mt-2 w-full bg-stone-100 dark:bg-stone-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (animals.filter(a => a.lot_id === lot.id).length / lot.quantity) * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h3 className="font-bold text-xl text-stone-800 dark:text-white flex items-center gap-2">
            <Beef className="text-orange-500" />
            Animais Cadastrados
          </h3>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
            <input
              type="text"
              placeholder="Buscar por tag, nome ou espécie..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none transition-colors"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-stone-900 rounded-2xl shadow-sm border border-stone-200 dark:border-stone-700 overflow-hidden">
          {filteredAnimals.length === 0 ? (
            <div className="p-12 text-center">
              <Beef size={48} className="mx-auto text-stone-300 dark:text-stone-600 mb-3" />
              <p className="text-stone-500 dark:text-stone-400 font-medium">
                {searchQuery ? 'Nenhum animal encontrado.' : 'Nenhum animal cadastrado. Clique em "Novo Animal" para começar.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-stone-500 dark:text-stone-400 uppercase bg-stone-50 dark:bg-stone-800/50">
                  <tr>
                    <th className="px-4 py-3 rounded-l-lg">Tag</th>
                    <th className="px-4 py-3">Nome</th>
                    <th className="px-4 py-3">Espécie</th>
                    <th className="px-4 py-3">Raça</th>
                    <th className="px-4 py-3 text-right">Peso (kg)</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 rounded-r-lg text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                  {filteredAnimals.map(animal => (
                    <tr key={animal.id} className="hover:bg-stone-50 dark:hover:bg-stone-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold text-stone-900 dark:text-white">{animal.tag}</span>
                      </td>
                      <td className="px-4 py-3 font-medium text-stone-900 dark:text-white">{animal.name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${speciesColors[animal.species] || ''}`}>
                          {animal.species}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-stone-600 dark:text-stone-400">{animal.breed || '—'}</td>
                      <td className="px-4 py-3 text-right font-bold text-stone-900 dark:text-white">
                        {animal.weight ? `${animal.weight.toFixed(1)}` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={animal.status}
                          onChange={e => handleStatusChange(animal.id, e.target.value)}
                          className={`px-2 py-1 rounded-lg text-xs font-bold border-0 cursor-pointer outline-none ${statusColors[animal.status] || ''}`}
                        >
                          <option value="active">Ativo</option>
                          <option value="sold">Vendido</option>
                          <option value="deceased">Óbito</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteAnimal(animal.id)}
                          className="text-stone-400 hover:text-red-500 transition-colors p-1"
                          title="Excluir"
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

      <AnimatePresence>
        {showAddAnimal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddAnimal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-700 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                    <Beef size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">Cadastrar Animal</h3>
                </div>
                <button onClick={() => setShowAddAnimal(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateAnimal} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Tag *</label>
                    <input
                      required
                      value={animalForm.tag}
                      onChange={e => setAnimalForm(f => ({ ...f, tag: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="BR-001"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Nome</label>
                    <input
                      value={animalForm.name}
                      onChange={e => setAnimalForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Mimosa"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Espécie *</label>
                    <select
                      required
                      value={animalForm.species}
                      onChange={e => setAnimalForm(f => ({ ...f, species: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    >
                      {speciesList.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Raça</label>
                    <input
                      value={animalForm.breed}
                      onChange={e => setAnimalForm(f => ({ ...f, breed: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Nelore"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Peso (kg)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={animalForm.weight}
                      onChange={e => setAnimalForm(f => ({ ...f, weight: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="450"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Nascimento</label>
                    <input
                      type="date"
                      value={animalForm.birth_date}
                      onChange={e => setAnimalForm(f => ({ ...f, birth_date: e.target.value }))}
                      className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Lote</label>
                  <select
                    value={animalForm.lot_id}
                    onChange={e => setAnimalForm(f => ({ ...f, lot_id: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option value="">Sem lote</option>
                    {lots.map(lot => (
                      <option key={lot.id} value={lot.id}>{lot.name} ({lot.species})</option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Cadastrar Animal'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddLot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddLot(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-stone-900 rounded-2xl shadow-2xl max-w-md w-full border border-stone-200 dark:border-stone-700 overflow-hidden"
            >
              <div className="flex items-center justify-between p-6 border-b border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg text-orange-600 dark:text-orange-400">
                    <Beef size={20} />
                  </div>
                  <h3 className="font-bold text-lg text-stone-900 dark:text-white">Novo Lote</h3>
                </div>
                <button onClick={() => setShowAddLot(false)} className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-300">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleCreateLot} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Nome do Lote *</label>
                  <input
                    required
                    value={lotForm.name}
                    onChange={e => setLotForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Lote de Engorda A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Espécie *</label>
                  <select
                    required
                    value={lotForm.species}
                    onChange={e => setLotForm(f => ({ ...f, species: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    {speciesList.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-500 dark:text-stone-400 uppercase mb-1">Quantidade de Animais *</label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={lotForm.quantity}
                    onChange={e => setLotForm(f => ({ ...f, quantity: e.target.value }))}
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-stone-900 dark:text-stone-100 focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-stone-900 dark:bg-white text-white dark:text-stone-900 py-3 rounded-xl font-bold hover:bg-stone-800 dark:hover:bg-stone-200 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Salvando...' : 'Criar Lote'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

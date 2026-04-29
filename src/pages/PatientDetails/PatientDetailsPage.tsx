import { memo, useCallback, useMemo } from 'react';
import { LayoutGrid, List, Search, X } from 'lucide-react';
import { usePatientStore } from '../../store/patientStore';
import { PatientGridCard, PatientListRow, PatientDetailModal } from './PatientCard';
import type { Patient } from '../../types';
import { PATIENTS } from '../../data/mockData';

const STATUSES = ['All', 'Stable', 'Critical', 'Recovering', 'Discharged'];
const WARDS = ['All', ...Array.from(new Set(PATIENTS.map(p => p.ward))).sort()];

export default function PatientDetailsPage() {
  const {
    viewMode, searchQuery, statusFilter, wardFilter, selectedPatient,
    setViewMode, setSearchQuery, setStatusFilter, setWardFilter,
    setSelectedPatient, filteredPatients,
  } = usePatientStore();

  const patients = useMemo(
    () => filteredPatients(),
    [filteredPatients, searchQuery, statusFilter, wardFilter]
  );

  const onSelect = useCallback((p: Patient) => setSelectedPatient(p), [setSelectedPatient]);
  const onClose = useCallback(() => setSelectedPatient(null), [setSelectedPatient]);
  const clearFilters = () => { setSearchQuery(''); setStatusFilter('All'); setWardFilter('All'); };

  const totals = useMemo(() => ({
    stable: PATIENTS.filter(p => p.status === 'Stable').length,
    critical: PATIENTS.filter(p => p.status === 'Critical').length,
    recovering: PATIENTS.filter(p => p.status === 'Recovering').length,
  }), []);

  const hasFilters = searchQuery || statusFilter !== 'All' || wardFilter !== 'All';

  return (
    <div className="max-w-6xl space-y-4">
      {/* Stat line */}
      <div className="flex items-center gap-6 text-[12px] text-zinc-500">
        <span><strong className="text-zinc-900 font-semibold">{PATIENTS.length}</strong> total</span>
        <span className="text-zinc-300">·</span>
        <span><strong className="text-green-700 font-semibold">{totals.stable}</strong> stable</span>
        <span className="text-zinc-300">·</span>
        <span><strong className="text-red-600 font-semibold">{totals.critical}</strong> critical</span>
        <span className="text-zinc-300">·</span>
        <span><strong className="text-blue-600 font-semibold">{totals.recovering}</strong> recovering</span>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-zinc-200 rounded px-4 py-3 space-y-3">
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search name, ID, condition, doctor…"
              className="w-full pl-8 pr-3 py-1.5 text-[13px] border border-zinc-200 rounded focus:outline-none focus:border-zinc-500 transition text-zinc-900 placeholder:text-zinc-400"
            />
          </div>

          {/* Ward */}
          <select
            value={wardFilter}
            onChange={e => setWardFilter(e.target.value)}
            className="px-3 py-1.5 text-[12px] border border-zinc-200 rounded focus:outline-none focus:border-zinc-500 text-zinc-700 bg-white cursor-pointer"
          >
            {WARDS.map(w => <option key={w} value={w}>{w === 'All' ? 'All wards' : w}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex items-center border border-zinc-200 rounded overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-2 py-1.5 transition-colors ${viewMode === 'grid' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <LayoutGrid size={13} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2 py-1.5 transition-colors ${viewMode === 'list' ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}
            >
              <List size={13} />
            </button>
          </div>
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-1.5">
          {STATUSES.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-[11px] px-2.5 py-1 rounded transition-colors border ${
                statusFilter === s
                  ? 'bg-zinc-900 text-white border-zinc-900'
                  : 'text-zinc-500 border-zinc-200 hover:border-zinc-400 hover:text-zinc-800'
              }`}
            >
              {s}
            </button>
          ))}
          {hasFilters && (
            <button onClick={clearFilters} className="ml-1 flex items-center gap-1 text-[11px] text-zinc-400 hover:text-zinc-700">
              <X size={10} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Count */}
      <p className="text-[11px] text-zinc-400">
        {patients.length === PATIENTS.length
          ? `${patients.length} patients`
          : `${patients.length} of ${PATIENTS.length} patients`}
      </p>

      {/* Results */}
      {patients.length === 0 ? (
        <div className="bg-white border border-zinc-200 rounded py-16 text-center">
          <p className="text-[13px] text-zinc-500">No patients match your filters.</p>
          <button onClick={clearFilters} className="mt-2 text-[12px] text-blue-600 hover:underline">
            Clear filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <GridView patients={patients} onSelect={onSelect} />
      ) : (
        <ListView patients={patients} onSelect={onSelect} />
      )}

      {selectedPatient && <PatientDetailModal patient={selectedPatient} onClose={onClose} />}
    </div>
  );
}

const GridView = memo(({ patients, onSelect }: { patients: Patient[]; onSelect: (p: Patient) => void }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
    {patients.map(p => <PatientGridCard key={p.id} patient={p} onSelect={onSelect} />)}
  </div>
));
GridView.displayName = 'GridView';

const ListView = memo(({ patients, onSelect }: { patients: Patient[]; onSelect: (p: Patient) => void }) => (
  <div className="bg-white border border-zinc-200 rounded overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[800px]">
        <thead className="bg-zinc-50 border-b border-zinc-200">
          <tr>
            {['Patient', 'Age / Gender', 'Condition', 'Status', 'Ward', 'Room', 'Doctor', 'Blood', 'Admitted'].map(h => (
              <th key={h} className="px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-400 whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {patients.map(p => <PatientListRow key={p.id} patient={p} onSelect={onSelect} />)}
        </tbody>
      </table>
    </div>
  </div>
));
ListView.displayName = 'ListView';

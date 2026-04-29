import { memo } from 'react';
import { Phone, Mail } from 'lucide-react';
import type { Patient } from '../../types';

const STATUS: Record<Patient['status'], string> = {
  Stable:     'text-green-700',
  Critical:   'text-red-600',
  Recovering: 'text-blue-600',
  Discharged: 'text-zinc-400',
};

interface Props { patient: Patient; onSelect: (p: Patient) => void; }

export const PatientGridCard = memo(({ patient: p, onSelect }: Props) => (
  <div
    onClick={() => onSelect(p)}
    className="bg-white border border-zinc-200 rounded p-4 cursor-pointer hover:border-zinc-400 transition-colors group"
  >
    <div className="flex items-start justify-between mb-3">
      <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
        <span className="text-zinc-600 text-[11px] font-semibold">
          {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </span>
      </div>
      <span className={`text-[11px] font-medium ${STATUS[p.status]}`}>{p.status}</span>
    </div>

    <p className="text-[13px] font-semibold text-zinc-900 group-hover:text-blue-700 transition-colors truncate">
      {p.name}
    </p>
    <p className="text-[11px] text-zinc-400 mt-0.5">{p.age}y · {p.gender} · {p.bloodType}</p>

    <div className="mt-3 pt-3 border-t border-zinc-100 space-y-0.5">
      <p className="text-[12px] text-zinc-600 truncate">{p.condition}</p>
      <p className="text-[11px] text-zinc-400 truncate">{p.ward} · {p.roomNumber}</p>
      <p className="text-[11px] text-zinc-400 truncate">{p.doctor}</p>
    </div>
  </div>
));
PatientGridCard.displayName = 'PatientGridCard';

export const PatientListRow = memo(({ patient: p, onSelect }: Props) => (
  <tr
    onClick={() => onSelect(p)}
    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50 cursor-pointer transition-colors"
  >
    <td className="px-4 py-3">
      <div className="flex items-center gap-2.5">
        <div className="w-6 h-6 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
          <span className="text-zinc-500 text-[10px] font-semibold">
            {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </span>
        </div>
        <div>
          <p className="text-[13px] font-medium text-zinc-900 whitespace-nowrap">{p.name}</p>
          <p className="text-[10px] text-zinc-400 font-mono">{p.id}</p>
        </div>
      </div>
    </td>
    <td className="px-4 py-3 text-[12px] text-zinc-600 whitespace-nowrap">{p.age} · {p.gender}</td>
    <td className="px-4 py-3 text-[12px] text-zinc-600 whitespace-nowrap">{p.condition}</td>
    <td className="px-4 py-3">
      <span className={`text-[12px] font-medium whitespace-nowrap ${STATUS[p.status]}`}>
        {p.status}
      </span>
    </td>
    <td className="px-4 py-3 text-[12px] text-zinc-600 whitespace-nowrap">{p.ward}</td>
    <td className="px-4 py-3 text-[12px] font-mono text-zinc-500 whitespace-nowrap">{p.roomNumber}</td>
    <td className="px-4 py-3 text-[12px] text-zinc-500 whitespace-nowrap max-w-[140px] truncate">{p.doctor}</td>
    <td className="px-4 py-3 text-[12px] font-mono text-zinc-500 whitespace-nowrap">{p.bloodType}</td>
    <td className="px-4 py-3 text-[12px] font-mono text-zinc-400 whitespace-nowrap">{p.admittedDate}</td>
  </tr>
));
PatientListRow.displayName = 'PatientListRow';

export const PatientDetailModal = memo(({ patient: p, onClose }: { patient: Patient; onClose: () => void }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4" onClick={onClose}>
    <div
      className="bg-white border border-zinc-200 rounded-lg shadow-xl w-full max-w-md overflow-hidden"
      onClick={e => e.stopPropagation()}
    >
      <div className="flex items-start justify-between px-5 py-4 border-b border-zinc-100">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-zinc-100 flex items-center justify-center flex-shrink-0">
            <span className="text-zinc-700 text-[13px] font-semibold">
              {p.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          <div>
            <p className="text-[14px] font-semibold text-zinc-900">{p.name}</p>
            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">{p.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-[12px] font-medium ${STATUS[p.status]}`}>{p.status}</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 text-lg leading-none transition-colors">×</button>
        </div>
      </div>

      <div className="p-5 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          {[
            ['Age', `${p.age} yrs`],
            ['Gender', p.gender],
            ['Blood', p.bloodType],
            ['Ward', p.ward],
            ['Room', p.roomNumber],
            ['Admitted', p.admittedDate],
          ].map(([l, v]) => (
            <div key={l}>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400">{l}</p>
              <p className="text-[13px] font-medium text-zinc-800 mt-0.5">{v}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-100 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Condition</p>
          <p className="text-[13px] text-zinc-800">{p.condition}</p>
        </div>

        <div className="border-t border-zinc-100 pt-3 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-2">Contact</p>
          <div className="flex items-center gap-2 text-[12px] text-zinc-600">
            <Phone size={11} className="text-zinc-400" />{p.phone}
          </div>
          <div className="flex items-center gap-2 text-[12px] text-zinc-600">
            <Mail size={11} className="text-zinc-400" />{p.email}
          </div>
          <p className="text-[12px] text-zinc-600">Insurance: <span className="font-medium">{p.insurance}</span></p>
        </div>

        <div className="border-t border-zinc-100 pt-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-1">Physician</p>
          <p className="text-[13px] font-medium text-zinc-800">{p.doctor}</p>
        </div>
      </div>
    </div>
  </div>
));
PatientDetailModal.displayName = 'PatientDetailModal';

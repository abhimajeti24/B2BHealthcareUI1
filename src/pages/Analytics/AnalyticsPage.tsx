import { useMemo } from 'react';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from 'recharts';
import {
  ADMISSIONS_DATA, DEPARTMENT_DATA, STATUS_DISTRIBUTION, SATISFACTION_DATA,
} from '../../data/mockData';

const T = { fontSize: 11, fill: '#a1a1aa' };
const G = { strokeDasharray: '3 3', stroke: '#f4f4f5' };

const TT = ({ active, payload, label }: {
  active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-zinc-200 rounded shadow-sm px-3 py-2 text-[11px]">
      {label && <p className="text-zinc-500 mb-1">{label}</p>}
      {payload.map(e => (
        <p key={e.name} style={{ color: e.color }}>
          {e.name}: <strong>{e.value}</strong>
        </p>
      ))}
    </div>
  );
};

function Panel({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-zinc-200 rounded p-5">
      <div className="mb-4">
        <p className="text-[12px] font-semibold text-zinc-800">{title}</p>
        {sub && <p className="text-[11px] text-zinc-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const dept = useMemo(() => DEPARTMENT_DATA.map(d => ({
    ...d, pct: Math.round((d.patients / d.capacity) * 100),
  })), []);

  return (
    <div className="w-full space-y-5">
      {/* Key metrics */}
      <div className="bg-white border border-zinc-200 rounded px-6 py-5">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-zinc-400 mb-4">Key metrics</p>
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Avg stay', value: '4.2 days', note: '↓ 0.3 days', pos: true },
            { label: 'Bed occupancy', value: '82%', note: '↑ 3%', warn: true },
            { label: 'Patient satisfaction', value: '91 / 100', note: '↑ 2pts', pos: true },
            { label: 'Readmission rate', value: '6.1%', note: '↓ 1.2%', pos: true },
          ].map(({ label, value, note, warn, pos }) => (
            <div key={label} className="border-r border-zinc-100 last:border-0 pr-6 last:pr-0">
              <p className="text-2xl font-semibold text-zinc-900 tracking-tight">{value}</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">{label}</p>
              <p className={`text-[11px] font-medium mt-0.5 ${warn ? 'text-amber-500' : pos ? 'text-green-600' : 'text-zinc-500'}`}>{note}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <Panel title="Admissions & Discharges" sub="6-month trend">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={ADMISSIONS_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...G} />
              <XAxis dataKey="month" tick={T} axisLine={false} tickLine={false} />
              <YAxis tick={T} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="admissions" name="Admissions" stroke="#3b82f6" strokeWidth={1.5} fill="url(#gA)" dot={false} />
              <Line type="monotone" dataKey="discharges" name="Discharges" stroke="#10b981" strokeWidth={1.5} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Critical Cases" sub="Monthly">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={ADMISSIONS_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid {...G} />
              <XAxis dataKey="month" tick={T} axisLine={false} tickLine={false} />
              <YAxis tick={T} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Line type="monotone" dataKey="criticals" name="Critical" stroke="#ef4444" strokeWidth={1.5}
                dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Patient Status">
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={STATUS_DISTRIBUTION} cx="50%" cy="50%" innerRadius={48} outerRadius={68} paddingAngle={2} dataKey="value">
                  {STATUS_DISTRIBUTION.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => [`${v}%`]} contentStyle={{ fontSize: 11, border: '1px solid #e4e4e7', borderRadius: 4 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full space-y-2 mt-2">
              {STATUS_DISTRIBUTION.map(s => (
                <div key={s.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                  <span className="text-[11px] text-zinc-600 flex-1">{s.name}</span>
                  <span className="text-[11px] font-semibold text-zinc-800 font-mono">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Panel title="Department Occupancy" sub="Patients vs capacity">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dept} layout="vertical" margin={{ top: 0, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid {...G} horizontal={false} />
              <XAxis type="number" tick={T} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="dept" tick={{ fontSize: 11, fill: '#71717a' }} axisLine={false} tickLine={false} width={86} />
              <Tooltip content={<TT />} />
              <Bar dataKey="patients" name="Patients" fill="#3b82f6" radius={[0, 2, 2, 0]} barSize={10} />
              <Bar dataKey="capacity" name="Capacity" fill="#e4e4e7" radius={[0, 2, 2, 0]} barSize={10} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Patient Satisfaction" sub="Monthly avg / 100">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={SATISFACTION_DATA} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
              <defs>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid {...G} />
              <XAxis dataKey="month" tick={T} axisLine={false} tickLine={false} />
              <YAxis domain={[75, 100]} tick={T} axisLine={false} tickLine={false} />
              <Tooltip content={<TT />} />
              <Area type="monotone" dataKey="score" name="Score" stroke="#8b5cf6" strokeWidth={1.5} fill="url(#gS)"
                dot={{ r: 3, fill: '#8b5cf6', strokeWidth: 0 }} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>
      </div>
    </div>
  );
}

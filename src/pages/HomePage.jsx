import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import {
  Zap, Fuel, TrendingUp, ShieldCheck, Package, AlertTriangle,
  ArrowUpRight, Droplets, Eye, ThumbsUp, ThumbsDown, RefreshCw,
  Clock, XCircle
} from 'lucide-react'
import AppShell from '../layout/AppShell.jsx'

// ─── animated counter ─────────────────────────────────────────────
function useAnimatedNumber(target, duration = 1200) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = null
    const step = ts => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setVal(Math.floor(p * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration])
  return val
}

// ─── live clock ───────────────────────────────────────────────────
function Now() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  return (
    <span>
      {now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
      {' · '}
      <span className="text-blue-600 font-mono">{now.toLocaleTimeString('en-IN', { hour12: true })}</span>
    </span>
  )
}

// ─── mock data ────────────────────────────────────────────────────
const genChartPoint = () => ({
  time: new Date().toLocaleTimeString('en-IN', { hour12: false }),
  inlet: +(2 + Math.random() * 3).toFixed(2),
  htst:  +(72 + Math.random() * 4).toFixed(1),
  flow:  Math.round(800 + Math.random() * 400),
})
const initialData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2,'0')}:00`,
  inlet: +(2 + Math.random() * 3).toFixed(2),
  htst:  +(72 + Math.random() * 4).toFixed(1),
  flow:  Math.round(800 + Math.random() * 400),
}))

const operationalRows = [
  { metric: 'Milk Planned',        value: '45,000 L', target: '45,000 L', status: 'ok'   },
  { metric: 'Milk Received',       value: '43,200 L', target: '45,000 L', status: 'warn' },
  { metric: 'Pasteurization Rate', value: '98.4%',    target: '≥ 98%',    status: 'ok'   },
  { metric: 'Fat Recovery',        value: '96.1%',    target: '≥ 95%',    status: 'ok'   },
  { metric: 'CIP Cycle',           value: '2 / 3',    target: '3 done',   status: 'warn' },
  { metric: 'HTST Temp',           value: '74.2 °C',  target: '72–76 °C', status: 'ok'   },
  { metric: 'Steam Pressure',      value: '4.8 bar',  target: '4–6 bar',  status: 'ok'   },
  { metric: 'ETP Inlet BOD',       value: '620 mg/L', target: '≤ 500',    status: 'crit' },
]

const alerts = [
  { type: 'warn', icon: Package,   title: 'Low Stock',       desc: 'Poly Film pouch material below 3-day buffer.' },
  { type: 'warn', icon: Clock,     title: 'Maintenance Due', desc: 'HTST Unit 2 PM overdue by 2 days.' },
  { type: 'crit', icon: XCircle,   title: 'QC Failure',      desc: 'Batch LP-0042: Coliform count exceeded limit.' },
  { type: 'warn', icon: Droplets,  title: 'ETP Warning',     desc: 'BOD levels trending above discharge norms.' },
]

const inventory = [
  { sku: 'FL-TM-500', product: 'Toned Milk 500 mL',  production: '18,240', stock: '4,820 L',  qc: 'pass'    },
  { sku: 'FL-FM-1L',  product: 'Full Cream 1 L',      production: '9,600',  stock: '2,100 L',  qc: 'pass'    },
  { sku: 'CUR-500G',  product: 'Curd 500 g',          production: '5,000',  stock: '1,240 kg', qc: 'fail'    },
  { sku: 'BTR-1KG',   product: 'Butter 1 kg',         production: '800',    stock: '340 kg',   qc: 'pass'    },
  { sku: 'PNR-200G',  product: 'Paneer 200 g',        production: '2,400',  stock: '680 kg',   qc: 'pending' },
]

const grnRows = [
  { id: 'V-001', source: 'Route A – Anand',       vol: '12,400', fat: '3.8' },
  { id: 'V-002', source: 'Route B – Mehsana',     vol: '9,800',  fat: '4.1' },
  { id: 'V-003', source: 'Route C – Sabarkantha', vol: '11,200', fat: '3.6' },
  { id: 'V-004', source: 'Private – GD Farms',    vol: '4,800',  fat: '4.5' },
  { id: 'V-005', source: 'Society – Kheda',        vol: '5,000',  fat: '3.9' },
]

// ─── primitives ───────────────────────────────────────────────────
const Card = ({ children, className = '' }) => (
  <div className={`card p-5 ${className}`}>{children}</div>
)

const Badge = ({ status }) => {
  const map = {
    ok:   'bg-green-50  text-green-700  border-green-200',
    warn: 'bg-amber-50  text-amber-700  border-amber-200',
    crit: 'bg-red-50    text-red-700    border-red-200',
  }
  const label = { ok: 'Operational', warn: 'Warning', crit: 'Critical' }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status]}`}>
      {label[status]}
    </span>
  )
}

const QcPill = ({ status }) => {
  const map = {
    pass:    'bg-green-50 text-green-700 border-green-200',
    fail:    'bg-red-50   text-red-700   border-red-200',
    pending: 'bg-amber-50 text-amber-700 border-amber-200',
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${map[status]} capitalize`}>
      {status}
    </span>
  )
}

const AlertCard = ({ item }) => {
  const Icon = item.icon
  const c = {
    warn: { bg: 'bg-amber-50', border: 'border-amber-200', icon: 'text-amber-500', dot: 'bg-amber-400' },
    crit: { bg: 'bg-red-50',   border: 'border-red-200',   icon: 'text-red-500',   dot: 'bg-red-400'   },
  }[item.type]
  return (
    <div className={`${c.bg} ${c.border} border rounded-2xl p-4 flex gap-3 items-start hover:scale-[1.01] transition-transform`}>
      <div className={`w-9 h-9 rounded-xl ${c.bg} border ${c.border} flex items-center justify-center flex-shrink-0`}>
        <Icon size={16} className={c.icon} />
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-slate-800">{item.title}</p>
          <span className={`w-1.5 h-1.5 rounded-full ${c.dot} flex-shrink-0`} />
        </div>
        <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
      </div>
    </div>
  )
}

// ─── KPI card ─────────────────────────────────────────────────────
function KpiCard({ title, value, unit, hint, icon: Icon, iconBg, bar }) {
  const raw = parseInt(value.replace(/[^0-9]/g, '')) || 0
  const num = useAnimatedNumber(raw)
  const display = isNaN(parseInt(value)) ? value : value.replace(/\d[\d,]*/, num.toLocaleString())

  return (
    <Card className="flex flex-col gap-4 hover:-translate-y-1 transition-transform cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{title}</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1 fade-up">{display}</p>
          {unit && <p className="text-[11px] text-slate-400 mt-0.5">{unit}</p>}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${iconBg} shadow-sm`}>
          <Icon size={18} className="text-white" />
        </div>
      </div>
      {bar !== undefined && (
        <div>
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>Progress</span><span>{bar}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100">
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${bar}%`, background: 'linear-gradient(90deg,#2563eb,#60a5fa)' }}
            />
          </div>
        </div>
      )}
      {hint && (
        <p className="text-[12px] text-slate-500 flex items-center gap-1">
          <ArrowUpRight size={12} className="text-green-500" />{hint}
        </p>
      )}
    </Card>
  )
}

// ─── chart tooltip ────────────────────────────────────────────────
const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-slate-400 mb-1">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: {typeof p.value === 'number' ? p.value.toFixed(1) : p.value}
        </p>
      ))}
    </div>
  )
}

// ─── section header ───────────────────────────────────────────────
const SectionTitle = ({ children, action }) => (
  <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
    <h2 className="text-sm font-bold text-slate-800">{children}</h2>
    {action}
  </div>
)

// ─── page ─────────────────────────────────────────────────────────
export default function HomePage() {
  const [liveData, setLiveData] = useState(initialData)

  useEffect(() => {
    const t = setInterval(() => {
      setLiveData(prev => [...prev.slice(1), genChartPoint()])
    }, 2000)
    return () => clearInterval(t)
  }, [])

  return (
    <AppShell>
      <div className="p-4 sm:p-6 space-y-6 pb-12">

        {/* ── Hero ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 px-6 py-8 sm:px-10 sm:py-10 text-center shadow-lg">
          <div className="absolute inset-0 bg-grid pointer-events-none" />
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="relative flex w-2.5 h-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-green-300 text-xs font-semibold tracking-widest uppercase">All Systems Operational</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Daily Operations Command Center
            </h1>
            <p className="text-blue-200 text-sm mt-2"><Now /></p>
          </div>
        </div>

        {/* ── KPI Cards ────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          <KpiCard title="Milk Planned vs Processed" value="43,200" unit="of 45,000 L planned" hint="+2.4% vs yesterday"   icon={Droplets}  iconBg="bg-blue-500"   bar={96} />
          <KpiCard title="Overall Yield"             value="94.2%"  unit="Yield efficiency"    hint="Above weekly avg"      icon={TrendingUp} iconBg="bg-indigo-500" bar={94} />
          <KpiCard title="QC Pass Rate"              value="97.8%"  unit="Batches passed today" hint="1 batch flagged"      icon={ShieldCheck} iconBg="bg-emerald-500" bar={98} />
          <KpiCard title="Total Daily Output"        value="38,400" unit="Liters processed today" hint="12 active SKUs"   icon={Package}   iconBg="bg-violet-500"           />
          <KpiCard title="Power Consumption"         value="1,840"  unit="kWh today"            hint="8% below target"     icon={Zap}       iconBg="bg-amber-500"  bar={72} />
          <KpiCard title="Diesel Consumption"        value="340"    unit="Liters — 4.2 L/kL"   hint="Within budget"        icon={Fuel}      iconBg="bg-orange-500" bar={60} />
        </div>

        {/* ── Operational Summary + Alerts ─────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Table */}
          <div className="lg:col-span-2 card overflow-hidden">
            <SectionTitle
              action={<RefreshCw size={13} className="text-slate-400 cursor-pointer hover:text-blue-500 transition-colors" />}
            >
              Operational Summary
            </SectionTitle>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {['Metric','Value','Target','Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {operationalRows.map((r, i) => (
                    <tr key={r.metric} className={`tr-hover border-b border-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                      <td className="px-5 py-3 text-slate-600 font-medium">{r.metric}</td>
                      <td className="px-5 py-3 text-slate-900 font-bold font-mono">{r.value}</td>
                      <td className="px-5 py-3 text-slate-400">{r.target}</td>
                      <td className="px-5 py-3"><Badge status={r.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-sm font-bold text-slate-800">Critical Alerts</h2>
              <AlertTriangle size={14} className="text-amber-500" />
            </div>
            {alerts.map((a, i) => <AlertCard key={i} item={a} />)}
          </div>
        </div>

        {/* ── Live Production Chart ─────────────────────────── */}
        <div className="card overflow-hidden">
          <SectionTitle>
            Live Production Line — Liquid Milk
            <span className="text-[11px] text-slate-400 ml-2 font-normal">Updates every 2s</span>
          </SectionTitle>
          <div className="flex flex-wrap gap-4 px-5 pt-4 text-[11px] text-slate-400">
            {[['#2563eb','Inlet Temp (°C)'],['#f59e0b','HTST Temp (°C)'],['#10b981','Flow Rate (L/hr)']].map(([c,l]) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: c }} />{l}
              </span>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={liveData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="time" tick={{ fill:'#94a3b8', fontSize:10 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis yAxisId="l" tick={{ fill:'#94a3b8', fontSize:10 }} tickLine={false} axisLine={false} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill:'#94a3b8', fontSize:10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<ChartTip />} />
                <Line yAxisId="l" type="monotone" dataKey="inlet" name="Inlet Temp" stroke="#2563eb" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="l" type="monotone" dataKey="htst"  name="HTST Temp"  stroke="#f59e0b" strokeWidth={2} dot={false} isAnimationActive={false} />
                <Line yAxisId="r" type="monotone" dataKey="flow"  name="Flow Rate"  stroke="#10b981" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Live Inventory & Dispatch ─────────────────────── */}
        <div className="card overflow-hidden">
          <SectionTitle>Live Inventory &amp; Dispatch</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['SKU Code','Product','Production','Stock','QC Status'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventory.map((r, i) => (
                  <tr key={r.sku} className={`tr-hover border-b border-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3 font-mono text-blue-600 text-xs font-semibold">{r.sku}</td>
                    <td className="px-5 py-3 text-slate-700">{r.product}</td>
                    <td className="px-5 py-3 text-slate-900 font-bold">{r.production}</td>
                    <td className="px-5 py-3 text-slate-600">{r.stock}</td>
                    <td className="px-5 py-3"><QcPill status={r.qc} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Today's GRN ──────────────────────────────────── */}
        <div className="card overflow-hidden">
          <SectionTitle>Today's GRN — Milk Reception</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50">
                  {['Vendor ID','Source','Volume (L)','Fat %','Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {grnRows.map((r, i) => (
                  <tr key={r.id} className={`tr-hover border-b border-slate-50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50'}`}>
                    <td className="px-5 py-3 font-mono text-blue-600 text-xs font-semibold">{r.id}</td>
                    <td className="px-5 py-3 text-slate-700">{r.source}</td>
                    <td className="px-5 py-3 text-slate-900 font-bold font-mono">{r.vol}</td>
                    <td className="px-5 py-3 text-slate-600 font-mono">{r.fat}%</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-[11px] font-semibold hover:bg-blue-100 transition-all">
                          <Eye size={11} />View
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-green-50 border border-green-200 text-green-700 text-[11px] font-semibold hover:bg-green-100 transition-all">
                          <ThumbsUp size={11} />Approve
                        </button>
                        <button className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 border border-red-200 text-red-600 text-[11px] font-semibold hover:bg-red-100 transition-all">
                          <ThumbsDown size={11} />Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AppShell>
  )
}

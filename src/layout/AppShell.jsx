import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, LogOut, Milk,
  Bell, Search, Building2, Menu, ChevronLeft, ChevronRight
} from 'lucide-react'

import {
  ClipboardList,
  ShoppingCart,
  Factory,
  ShieldCheck,
  Boxes,
  Package,
  Wrench,
  BarChart3,

  Droplets,
  FileText,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Users', icon: Users, path: '/users' },
  { label: 'MIS Dashboard', icon: BarChart3, path: '/mis-dashboard' },
  { label: 'Production Planning', icon: ClipboardList, path: '/production-planning' },
  { label: 'Procurement', icon: ShoppingCart, path: '/procurement' },
  { label: 'Factory Floor', icon: Factory, path: '/factory-floor' },
  { label: 'Quality Control', icon: ShieldCheck, path: '/quality-control' },
  { label: 'Inventory Management', icon: Boxes, path: '/inventory-management' },
  { label: 'SKU Module', icon: Package, path: '/sku-module' },
  { label: 'Equipment & Maintenance', icon: Wrench, path: '/equipment-maintenance' },
  { label: 'CRM / Sales & Marketing', icon: BarChart3, path: '/crm-sales-marketing' },
  { label: 'Admin & Accounts', icon: Building2, path: '/admin-accounts' },
  { label: 'ETP Management', icon: Droplets, path: '/etp-management' },
  { label: 'Daily Reports', icon: FileText, path: '/daily-reports' },
]
function Clock() {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(t) }, [])
  return <span className="font-mono text-xs text-slate-500">{now.toLocaleTimeString('en-IN', { hour12: false })}</span>
}

export default function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  const Sidebar = ({ mobile = false }) => (
    <aside className={`
      flex flex-col h-full transition-all duration-300
      ${collapsed && !mobile ? 'w-[68px]' : 'w-[220px]'}
      bg-white border-r border-slate-200
    `}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-100">
        <div className="flex-shrink-0 w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center shadow-md">
          <Milk size={18} className="text-white" />
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="text-slate-900 font-bold text-sm leading-none">MPP ERP</p>
            <p className="text-blue-500 text-[10px] mt-0.5 tracking-widest uppercase">Milk Processing</p>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-0.5">
        {(!collapsed || mobile) && (
          <p className="text-[10px] font-semibold tracking-widest uppercase text-slate-400 px-3 mb-2">
            Navigation
          </p>
        )}
        {NAV.map(item => {
          const Icon = item.icon
          const isActive = location.pathname === item.path
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); if (mobile) setMobileOpen(false) }}
              title={collapsed && !mobile ? item.label : undefined}
              className={`
                nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
                ${isActive ? 'active text-blue-700' : 'text-slate-500'}
                ${collapsed && !mobile ? 'justify-center' : ''}
              `}
            >
              <Icon size={16} className={`flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
              {(!collapsed || mobile) && (
                <span className={`text-[13px] font-medium ${isActive ? 'text-blue-700' : 'text-slate-600'}`}>
                  {item.label}
                </span>
              )}
              {isActive && (!collapsed || mobile) && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />
              )}
            </button>
          )
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {(!collapsed || mobile) && (
          <div className="px-3 py-2 rounded-xl bg-slate-50 mb-2">
            <p className="text-xs font-semibold text-slate-700 truncate">{currentUser.name || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate capitalize">{currentUser.role}</p>
          </div>
        )}
        <button
          onClick={logout}
          title="Logout"
          className="nav-item w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:!bg-red-50 transition-all"
        >
          <LogOut size={16} className="flex-shrink-0" />
          {(!collapsed || mobile) && <span className="text-[13px] font-medium">Logout</span>}
        </button>
        {/* Collapse toggle (desktop only) */}
        {!mobile && (
          <button
            onClick={() => setCollapsed(v => !v)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        )}
      </div>
    </aside>
  )

  return (
    <div className="flex h-full bg-slate-50">
      {/* Desktop sidebar */}
      <div className="hidden sm:flex flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex sm:hidden">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="relative z-10 w-[220px]"><Sidebar mobile /></div>
        </div>
      )}

      {/* Main */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Navbar */}
        <header className="sticky top-0 z-40 flex items-center gap-3 px-4 sm:px-6 h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm flex-shrink-0">
          <button className="sm:hidden text-slate-400 hover:text-slate-700" onClick={() => setMobileOpen(v => !v)}>
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <Building2 size={15} className="text-blue-500" />
            <span className="text-slate-800 font-semibold">Galaxy Dairy</span>
            <span className="text-slate-300">/</span>
            <span className="text-blue-600 font-medium">
              {NAV.find(n => n.path === location.pathname)?.label ?? 'Dashboard'}
            </span>
          </div>
          <div className="flex-1" />
          <div className="hidden md:flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 w-48">
            <Search size={13} className="text-slate-400" />
            <input placeholder="Search…" className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-full" />
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-[11px] font-semibold">
              <span className="relative flex w-2 h-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live
            </span>
            <Clock />
          </div>
          <button className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-500" />
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center text-white text-xs font-bold shadow-md">
            {(currentUser.name || 'U')[0].toUpperCase()}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

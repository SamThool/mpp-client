import { useState, useEffect } from 'react'
import { UserPlus, Trash2, X, Search, Users } from 'lucide-react'
import api from '../api/axios.js'
import AppShell from '../layout/AppShell.jsx'

// ── Add User Modal ─────────────────────────────────────────────────
function AddUserModal({ onClose, onAdded }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/api/users', form)
      onAdded(data)
      onClose()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-800">Add New User</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2.5 rounded-xl">
              {error}
            </div>
          )}

          {[
            { label: 'Full Name',    field: 'name',     type: 'text',     placeholder: 'John Doe' },
            { label: 'Email',        field: 'email',    type: 'email',    placeholder: 'john@mpp.com' },
            { label: 'Phone Number', field: 'phone',    type: 'tel',      placeholder: '9876543210 (optional)' },
            { label: 'Password',     field: 'password', type: 'password', placeholder: 'Min 6 characters' },
          ].map(({ label, field, type, placeholder }) => (
            <div key={field}>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
              <input
                type={type}
                value={form[field]}
                onChange={e => update(field, e.target.value)}
                placeholder={placeholder}
                required={field !== 'phone'}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 placeholder-slate-400 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <UserPlus size={15} />}
              {loading ? 'Adding…' : 'Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Delete Confirm Modal ───────────────────────────────────────────
function DeleteModal({ user, onClose, onDeleted }) {
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    setLoading(true)
    try {
      await api.delete(`/api/users/${user._id}`)
      onDeleted(user._id)
      onClose()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-sm">
        <div className="px-6 py-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-4">
            <Trash2 size={22} className="text-red-500" />
          </div>
          <h3 className="text-base font-bold text-slate-800 mb-1">Delete User</h3>
          <p className="text-sm text-slate-500">
            Are you sure you want to delete <b className="text-slate-700">{user.name}</b>? This cannot be undone.
          </p>
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Trash2 size={14} />}
              {loading ? 'Deleting…' : 'Delete'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Users Page ────────────────────────────────────────────────
export default function UsersPage() {
  const [users,       setUsers]       = useState([])
  const [search,      setSearch]      = useState('')
  const [loading,     setLoading]     = useState(true)
  const [showAdd,     setShowAdd]     = useState(false)
  const [deleteUser,  setDeleteUser]  = useState(null)

  useEffect(() => {
    api.get('/api/users')
      .then(({ data }) => setUsers(data))
      .catch(() => alert('Failed to load users'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone || '').includes(search)
  )

  const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
  const isAdmin = currentUser.role === 'admin'

  return (
    <AppShell>
      <div className="p-4 sm:p-6">

        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">Users</h1>
            <p className="text-sm text-slate-500 mt-0.5">{users.length} registered user{users.length !== 1 ? 's' : ''}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm">
              <Search size={14} className="text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search users…"
                className="bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none w-40"
              />
            </div>
            {/* Add button (admin only) */}
            {isAdmin && (
              <button
                onClick={() => setShowAdd(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md shadow-blue-200 transition-all"
              >
                <UserPlus size={15} />
                Add User
              </button>
            )}
          </div>
        </div>

        {/* Table card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-slate-400">
              <span className="w-6 h-6 border-2 border-slate-200 border-t-blue-500 rounded-full animate-spin mr-3" />
              Loading users…
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
              <Users size={36} className="mb-3 opacity-30" />
              <p className="text-sm font-medium">{search ? 'No users match your search' : 'No users yet'}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">#</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Name</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Email</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Phone</th>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Created</th>
                    {isAdmin && <th className="text-left px-5 py-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((user, i) => (
                    <tr key={user._id} className="tr-hover border-b border-slate-50 transition-colors">
                      <td className="px-5 py-3.5 text-slate-400">{i + 1}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-800">{user.name}</td>
                      <td className="px-5 py-3.5 text-slate-600">{user.email}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono text-xs">{user.phone || '—'}</td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-3.5">
                          <button
                            onClick={() => setDeleteUser(user)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-500 hover:bg-red-100 text-[11px] font-semibold transition-all"
                          >
                            <Trash2 size={12} />Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAdd   && <AddUserModal   onClose={() => setShowAdd(false)}    onAdded={u => setUsers(prev => [u, ...prev])} />}
      {deleteUser && <DeleteModal   user={deleteUser} onClose={() => setDeleteUser(null)} onDeleted={id => setUsers(prev => prev.filter(u => u._id !== id))} />}
    </AppShell>
  )
}

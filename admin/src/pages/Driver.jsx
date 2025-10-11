import React, { useEffect, useMemo, useState, useRef } from 'react'
import axios from 'axios'

const Driver = () => {
  const API_BASE = useMemo(() => 'https://bustrac-backend.onrender.com', [])
  const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/drx3wkg1h/image/upload'
  const CLOUDINARY_PRESET = 'BusTrac'

  const [drivers, setDrivers] = useState([])
  const [cities, setCities] = useState([])
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDriver, setEditingDriver] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', city: '', image: '' })
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [localPreview, setLocalPreview] = useState('')
  const fileInputRef = useRef(null)

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 350)
    return () => clearTimeout(id)
  }, [query])

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_BASE}/drivers/cities`)
      setCities(res?.data?.cities || [])
    } catch (e) {
      // ignore
    }
  }

  const fetchDrivers = async () => {
    try {
      setError('')
      setLoading(true)
      const params = {}
      if (city) params.city = city
      if (debouncedQuery) params.q = debouncedQuery
      const res = await axios.get(`${API_BASE}/drivers`, { params })
      setDrivers(res?.data?.drivers || res?.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to fetch drivers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCities() }, [])
  useEffect(() => { fetchDrivers() }, [city, debouncedQuery])

  // CRUD handlers
  const openAdd = () => {
    setEditingDriver(null)
    setForm({ name: '', email: '', password: '', city: '', image: '' })
    setLocalPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
    setModalOpen(true)
  }

  const openEdit = (d) => {
    setEditingDriver(d)
    setForm({ name: d.name || '', email: d.email || '', password: '', city: d.city || '', image: d.image || '' })
    setLocalPreview(d.image || '')
    setModalOpen(true)
  }

  const closeModal = () => {
    if (saving) return
    setModalOpen(false)
    setEditingDriver(null)
    setForm({ name: '', email: '', password: '', city: '', image: '' })
    setLocalPreview('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const uploadImage = async (file) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', CLOUDINARY_PRESET)
      
      // Use fetch instead of axios to avoid CORS issues with auth headers
      const response = await fetch(CLOUDINARY_URL, {
        method: 'POST',
        body: fd,
        // No headers needed - fetch will set Content-Type automatically for FormData
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      const url = data?.secure_url || data?.url
      if (url) {
        setForm((f) => ({ ...f, image: url }))
        setLocalPreview(url)
      } else {
        setError('No image URL returned from Cloudinary')
      }
    } catch (e) {
      setError(e.message || 'Image upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleFileChange = async (e) => {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setLocalPreview(preview)
    await uploadImage(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      if (uploading) {
        setError('Please wait for the image upload to complete before saving')
        setSaving(false)
        return
      }
      const payload = {
        name: String(form.name).trim(),
        email: String(form.email).trim(),
        city: String(form.city).trim(),
        image: form.image || undefined,
      }
      if (!payload.name || !payload.email || !payload.city) {
        setError('Please provide name, email and city')
        setSaving(false)
        return
      }
      if (editingDriver?._id) {
        // include password only if provided
        const upd = { ...payload }
        if (form.password) upd.password = form.password
        await axios.put(`${API_BASE}/drivers/${editingDriver._id}`, upd)
      } else {
        if (!form.password) {
          setError('Please set a password for the new driver')
          return
        }
        await axios.post(`${API_BASE}/drivers`, { ...payload, password: form.password })
      }
      await fetchDrivers()
      setModalOpen(false)
      setEditingDriver(null)
      setForm({ name: '', email: '', password: '', city: '', image: '' })
      setLocalPreview('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to save driver')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (d) => {
    const ok = window.confirm(`Delete driver ${d.name}?`)
    if (!ok) return
    try {
      setError('')
      await axios.delete(`${API_BASE}/drivers/${d._id}`)
      await fetchDrivers()
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to delete driver')
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow ring-1 ring-slate-900/5 p-6 sm:p-8 mb-6">
        <div className="pointer-events-none absolute inset-0">
          <div className="hidden md:block absolute -top-16 -left-16 w-56 h-56 rounded-full bg-teal-400/15 blur-3xl" />
          <div className="hidden sm:block absolute -bottom-20 -right-10 w-72 h-72 rounded-full bg-sky-400/15 blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900">Drivers</h1>
            <p className="text-slate-600 lg:text-xl">Manage all drivers with filters and search</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <button
              onClick={openAdd}
              className="order-3 sm:order-none inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:shadow-lg transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v14m-7-7h14"/></svg>
              Add Driver
            </button>
            <div className="relative w-full sm:w-72 lg:w-80">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
            </div>
            <div className="w-full sm:w-56">
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="mb-4 rounded-2xl border border-orange-200 bg-orange-50 p-3 text-sm text-orange-800">{error}</div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white ring-1 ring-slate-900/5 shadow-md animate-pulse w-full max-w-sm mx-auto overflow-hidden">
            <div className="aspect-[4/3] bg-slate-100 rounded-t-3xl" />
            <div className="p-4">
              <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
              <div className="h-3 bg-slate-100 rounded w-1/2 mb-3" />
              <div className="flex gap-2">
                <div className="h-8 bg-slate-100 rounded flex-1" />
                <div className="h-8 bg-slate-100 rounded flex-1" />
              </div>
            </div>
          </div>
        ))}

        {!loading && drivers && drivers.length === 0 && (
          <div className="col-span-full">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No drivers found.
            </div>
          </div>
        )}

        {!loading && (drivers || []).map((d) => (
          <div key={d._id || d.email} className="group rounded-3xl border border-slate-200 bg-white ring-1 ring-slate-900/5 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden w-full max-w-sm mx-auto">
            <div className="relative aspect-[4/3] rounded-t-3xl overflow-hidden bg-gradient-to-br from-slate-50 to-white">
              {d.image ? (
                <img 
                  src={d.image} 
                  alt={d.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`${d.image ? 'absolute inset-0 bg-black/40' : ''} flex items-center justify-center text-center ${d.image ? 'text-white' : 'text-slate-900'}`} style={{display: d.image ? 'none' : 'flex'}}>
                <div>
                  <div className="text-xl font-extrabold">{d.name}</div>
                  <div className={`text-sm ${d.image ? 'text-white/80' : 'text-slate-600'}`}>{d.email}</div>
                </div>
              </div>
              {d.image && (
                <div className="absolute bottom-2 left-2 right-2 text-center">
                  <div className="text-white font-bold text-sm bg-black/50 rounded px-2 py-1">{d.name}</div>
                  <div className="text-white/90 text-xs">{d.email}</div>
                </div>
              )}
              <div className="absolute top-3 right-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm bg-white/90 text-slate-700 border-slate-200">
                {d.city}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-lg font-extrabold text-slate-900">{d.name}</div>
                  <div className="text-slate-600 text-sm">{d.email}</div>
                </div>
                <div className="text-xs text-slate-500">
                  {d.createdAt ? new Date(d.createdAt).toLocaleDateString() : ''}
                </div>
              </div>
              <div className="text-slate-600 text-sm mb-3">
                {d.activeBus ? `Active Bus: #${d.activeBus.busNumber || ''}` : 'No active bus'}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(d)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 20h4l10.5-10.5a2.5 2.5 0 00-3.536-3.536L4 16v4z"/></svg>
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(d)}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-rose-200 text-rose-700 hover:bg-rose-50 text-sm font-medium transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 7h12M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2m-7 0v12m4-12v12M5 7l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14"/></svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative z-10 w-[92%] max-w-lg rounded-2xl bg-white border border-slate-200 shadow-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="text-lg font-extrabold text-slate-900">{editingDriver ? 'Edit Driver' : 'Add Driver'}</div>
              <button onClick={closeModal} className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            {error && (
              <div className="mb-2 rounded-xl border border-orange-200 bg-orange-50 p-2 text-xs text-orange-800">{error}</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Name</label>
                  <input name="name" value={form.name} onChange={handleFormChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. John Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleFormChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. john@mail.com" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Password {editingDriver ? '(leave blank to keep)' : ''}</label>
                  <input type="password" name="password" value={form.password} onChange={handleFormChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder={editingDriver ? '••••••••' : 'Set a password'} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">City</label>
                  <input name="city" value={form.city} onChange={handleFormChange} className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="e.g. Jaipur" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">Upload Image</label>
                  <div className="flex items-center gap-3">
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-slate-600 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200" />
                  </div>
                  {(localPreview || form.image) && (
                    <div className="mt-3 flex items-center gap-3">
                      <img src={localPreview || form.image} alt="preview" className="w-20 h-20 rounded-xl object-cover border" />
                      {uploading && (
                        <div className="flex-1">
                          <div className="h-2 w-full rounded bg-slate-100">
                            <div className="h-2 rounded bg-blue-600" style={{ width: `${uploadProgress}%` }} />
                          </div>
                          <div className="text-xs text-slate-500 mt-1">Uploading {uploadProgress}%</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button type="button" onClick={closeModal} className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50">Cancel</button>
                <button disabled={saving || uploading} className="px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold shadow hover:shadow-lg disabled:opacity-60">
                  {uploading ? 'Uploading...' : saving ? 'Saving...' : editingDriver ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Driver

import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const Bus = () => {
  const API_BASE = useMemo(() => 'http://localhost:2000', [])

  const [buses, setBuses] = useState([])
  const [cities, setCities] = useState([])
  const [city, setCity] = useState('')
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Debounce query
  const [debouncedQuery, setDebouncedQuery] = useState('')
  useEffect(() => {
    const id = setTimeout(() => setDebouncedQuery(query.trim()), 350)
    return () => clearTimeout(id)
  }, [query])

  const fetchCities = async () => {
    try {
      const res = await axios.get(`${API_BASE}/buses/cities`)
      setCities(res?.data?.cities || [])
    } catch (e) {
      // non-blocking
    }
  }

  const fetchBuses = async () => {
    try {
      setError('')
      setLoading(true)
      const params = {}
      if (city) params.city = city
      if (debouncedQuery) params.q = debouncedQuery
      const res = await axios.get(`${API_BASE}/buses`, { params })
      setBuses(res?.data?.buses || res?.data || [])
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to fetch buses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    fetchBuses()
  }, [city, debouncedQuery])

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
            <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-slate-900">Buses</h1>
            <p className="text-slate-600 lg:text-xl">Manage all buses with filters and search</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by bus number..."
                className="w-64 lg:w-80 pl-10 pr-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
            </div>
            <div>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
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
      <div className="grid [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))] gap-6">
        {loading && Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-3xl border border-slate-200 bg-white p-4 ring-1 ring-slate-900/5 shadow-md animate-pulse">
            <div className="h-32 bg-slate-100 rounded-xl mb-3" />
            <div className="h-4 bg-slate-100 rounded w-2/3 mb-2" />
            <div className="h-4 bg-slate-100 rounded w-1/2" />
          </div>
        ))}

        {!loading && buses && buses.length === 0 && (
          <div className="col-span-full">
            <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center text-slate-600">
              No buses found.
            </div>
          </div>
        )}

        {!loading && (buses || []).map((b) => (
          <div key={b._id || b.busNumber} className="group rounded-3xl border border-slate-200 bg-white p-4 ring-1 ring-slate-900/5 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-100 mb-3">
              <img
                alt={b.busNumber}
                src={b.image || 'https://images.unsplash.com/photo-1521292270410-a8c4d716d518?q=80&w=1600&auto=format&fit=crop'}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
              />
              <div
                className={`absolute top-2 right-2 inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-semibold border ${
                  b.status === 'Active'
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {b.status || 'Inactive'}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xl font-extrabold text-slate-900">Bus #{b.busNumber}</div>
                <div className="text-slate-600 text-sm">{b.city} • {b.totalSeats} seats</div>
              </div>
              <div className="text-xs text-slate-500">
                {b.createdAt ? new Date(b.createdAt).toLocaleDateString() : ''}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Bus

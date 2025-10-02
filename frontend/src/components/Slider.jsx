import React, { useMemo, useState } from 'react'
import { assets } from '../assets/assets'

/*
  Simple continuous slider that moves images from right to left and restarts seamlessly.
  - Props:
    images?: string[]        // image URLs, falls back to assets
    height?: string          // tailwind height classes (e.g., 'h-40 md:h-56 lg:h-64')
    speedSeconds?: number    // how fast the strip moves (default 20s)
    gap?: string             // tailwind gap classes between images (default 'gap-4')
*/
const Slider = ({
  images,
  height = 'h-40 md:h-56 lg:h-64',
  speedSeconds = 20,
  gap = 'gap-4',
  title = 'Popular Buses & moments',
  showHeader = true,
}) => {
  const [isHovering, setIsHovering] = useState(false)
  const fallback = useMemo(() => {
    const arr = [assets?.d1, assets?.d2, assets?.d3, assets?.d4, assets?.d5, assets?.d6].filter(Boolean)
    // Ensure we have at least 3 items to make the loop feel natural
    return arr.length >= 3 ? arr : ['/vite.svg', '/vite.svg', '/vite.svg']
  }, [])

  const imgs = images && images.length > 0 ? images : fallback
  const animationDuration = `${speedSeconds}s`

  return (
    <section className="w-full bg-gradient-to-b from-white via-slate-50 to-white">
      <div className="max-w-9xl mx-auto px-4 sm:px-6">
        {showHeader && (
          <div className="py-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
          </div>
        )}

        {/* Decorative gradient backdrop */}
        <div className={`relative w-full overflow-hidden ${height} rounded-3xl ring-1 ring-slate-900/5 shadow-lg bg-white/60 backdrop-blur-[2px]` }>
          <div className="pointer-events-none absolute -top-20 -left-10 h-48 w-48 rounded-full bg-gradient-to-br from-sky-400/20 via-teal-400/20 to-indigo-400/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-16 h-56 w-56 rounded-full bg-gradient-to-br from-amber-400/20 via-orange-400/20 to-sky-400/20 blur-3xl" />

          {/* Edge fade mask for nicer entry/exit */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
              background: 'linear-gradient(to right, rgba(255,255,255,1), rgba(255,255,255,0) 12%, rgba(255,255,255,0) 88%, rgba(255,255,255,1))',
            }}
          />

          {/* Track: duplicate content for seamless loop */}
          <div
            className={`relative flex ${gap} items-center h-full will-change-transform px-4`}
            style={{
              width: 'max-content',
              animation: `slide-left ${animationDuration} linear infinite`,
              animationPlayState: isHovering ? 'paused' : 'running',
            }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {[...imgs, ...imgs].map((src, idx) => (
              <div key={idx} className="relative shrink-0 h-full aspect-[16/10] overflow-hidden rounded-2xl bg-white ring-1 ring-slate-900/10 ring-offset-1 ring-offset-slate-100 shadow-md hover:shadow-xl transition-shadow">
                <img
                  src={src}
                  alt={`slide-${idx}`}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.05]"
                  loading={idx < imgs.length ? 'eager' : 'lazy'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Local keyframes for the marquee animation */}
      <style>{`
        @keyframes slide-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

export default Slider

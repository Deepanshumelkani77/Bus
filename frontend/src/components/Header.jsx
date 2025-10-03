import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import {assets} from '../assets/assets'


const Header = () => {

const images=[assets.i1,assets.i2,assets.i3]

  // Fallback to a simple placeholder from public if no images are provided yet
  const fallbackImages = useMemo(() => (images && images.length > 0 ? images : ['/vite.svg']), [images])

  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [touchStartX, setTouchStartX] = useState(null)
  const [isPlaying, setIsPlaying] = useState(true) // auto-slide on by default

  // Optional captions (simple defaults; you can customize later)
  const captions = useMemo(
    () => new Array(fallbackImages.length).fill(''),
    [fallbackImages.length]
  )

  const next = () => setCurrent((prev) => (prev + 1) % fallbackImages.length)
    
  const prev = () => setCurrent((prev) => (prev - 1 + fallbackImages.length) % fallbackImages.length)

  // Gentle auto-slide every 5s, pause on hover
  useEffect(() => {
    if (fallbackImages.length <= 1) return
    if (!isPlaying) return
    if (isHovering) return
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % fallbackImages.length)
    }, 5000)
    return () => clearInterval(id)
  }, [fallbackImages.length, isHovering, isPlaying])

  return (
    <div
      className="relative w-full mx-auto select-none h-[35vh] md:h-[60vh] lg:h-[95vh] overflow-hidden bg-gradient-to-br from-[#0F172A] via-slate-900 to-slate-800"
      role="region"
      aria-roledescription="carousel"
      aria-label="Header image slider"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev()
        else if (e.key === 'ArrowRight') next()
        else if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') setIsPlaying((p) => !p)
      }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Background Pattern (lighter so blobs stand out) */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.4\'%3E%3Ccircle cx=\'7\' cy=\'7\' r=\'1\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          }}
        />
      </div>

      {/* Animated Background Blobs (above slider for visibility) */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-blue-500/25 -top-20 -left-20 animate-pulse" />
        <div className="absolute w-64 h-64 md:w-80 md:h-80 rounded-full bg-indigo-500/25 top-1/3 -right-16 md:-right-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute w-56 h-56 md:w-64 md:h-64 rounded-full bg-orange-500/20 bottom-10 left-1/4 animate-pulse" style={{ animationDelay: '2s' }} />
      </div>
      {/* Slider container */}
      <div className="relative z-10 w-full ">
        {/* Image area - responsive ratio with gentle fade */}
        <div
          className="relative w-full overflow-hidden  bg-gray-100 h-[35vh] md:h-[60vh] lg:h-[90vh]"
          onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStartX === null) return
            const diff = e.changedTouches[0].clientX - touchStartX
            const threshold = 50 // minimal swipe distance
            if (diff > threshold) {
              prev()
            } else if (diff < -threshold) {
              next()
            }
            setTouchStartX(null)
          }}
          onClick={() => next()}
        >
          {/* Maintain aspect ratio on small screens, grow on larger */}
          <div className="aspect-[16/9] sm:h-56 md:h-72 lg:h-[420px] xl:h-[520px]">
            {fallbackImages.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`slide-${idx + 1}`}
                className={
                  'absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ' +
                  (idx === current ? 'opacity-100' : 'opacity-0')
                }
                loading={idx === current ? 'eager' : 'lazy'}
              />
            ))}
            {/* Caption overlay (minimal) */}
            {captions[current] && (
              <div className="absolute inset-x-0 bottom-0 bg-black/35 text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-2">
                {captions[current]}
              </div>
            )}
          </div>

          {/* Prev/Next Controls (minimal styling) */}
          {fallbackImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-1.5 sm:p-2 md:p-3 hover:bg-black/50 focus:outline-none text-base sm:text-xl md:text-2xl"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-1.5 sm:p-2 md:p-3 hover:bg-black/50 focus:outline-none text-base sm:text-xl md:text-2xl"
              >
                ›
              </button>

              {/* Play/Pause toggle */}
              <button
                type="button"
                onClick={() => setIsPlaying((p) => !p)}
                aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
                className="absolute right-2 top-2 rounded-full bg-black/40 text-white px-2 py-1 text-xs sm:text-sm hover:bg-black/50"
              >
                {isPlaying ? 'Pause' : 'Play'}
              </button>

              {/* Counter */}
              <div className="absolute left-2 top-2 rounded bg-black/40 text-white px-2 py-1 text-xs sm:text-sm">
                {current + 1} / {fallbackImages.length}
              </div>
            </>
          )}
        </div>

        {/* Dots indicators */}
        {fallbackImages.length > 1 && (
          <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2">
            {fallbackImages.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={
                  'rounded-full transition-colors ' +
                  (idx === current
                    ? 'bg-gray-800 h-2 w-2 sm:h-2.5 sm:w-2.5'
                    : 'bg-gray-300 hover:bg-gray-400 h-2 w-2 sm:h-2.5 sm:w-2.5')
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Header

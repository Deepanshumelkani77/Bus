import React from 'react'
import { useEffect, useMemo, useState } from 'react'
import {assets} from '../assets/assets'


const Header = () => {

const images=[assets.i1,assets.i2,assets.i3]

  // Fallback to a simple placeholder from public if no images are provided yet
  const fallbackImages = useMemo(() => (images && images.length > 0 ? images : ['/vite.svg']), [images])

  const [current, setCurrent] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const next = () => setCurrent((prev) => (prev + 1) % fallbackImages.length)
    
  const prev = () => setCurrent((prev) => (prev - 1 + fallbackImages.length) % fallbackImages.length)

  // Gentle auto-slide every 5s, pause on hover
  useEffect(() => {
    if (fallbackImages.length <= 1) return
    if (isHovering) return
    const id = setInterval(() => {
      setCurrent((prev) => (prev + 1) % fallbackImages.length)
    }, 5000)
    return () => clearInterval(id)
  }, [fallbackImages.length, isHovering])

  return (
    <div
      className="w-full mx-auto select-none"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Slider container */}
      <div className="relative w-full max-w-5xl mx-auto">
        {/* Image area - responsive ratio with gentle fade */}
        <div className="relative w-full overflow-hidden rounded-xl bg-gray-100">
          {/* Maintain aspect ratio on small screens, grow on larger */}
          <div className="aspect-[16/9] md:h-[420px]">
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
          </div>

          {/* Prev/Next Controls (minimal styling) */}
          {fallbackImages.length > 1 && (
            <>
              <button
                type="button"
                aria-label="Previous slide"
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 hover:bg-black/50 focus:outline-none"
              >
                ‹
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/40 text-white p-2 hover:bg-black/50 focus:outline-none"
              >
                ›
              </button>
            </>
          )}
        </div>

        {/* Dots indicators */}
        {fallbackImages.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {fallbackImages.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Go to slide ${idx + 1}`}
                onClick={() => setCurrent(idx)}
                className={
                  'h-2.5 w-2.5 rounded-full transition-colors ' +
                  (idx === current ? 'bg-gray-800' : 'bg-gray-300 hover:bg-gray-400')
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

import React from 'react'
import { assets } from '../assets/assets'

const Video = ({
  src,
  poster,
  title = 'See BusTrac in action',
  subtitle = 'Real-time tracking and traffic‑aware ETAs, in a clean and modern interface.',
  autoPlay = true,
  loop = true,
  muted = true,
}) => {
  const videoSrc = src || assets?.vid2

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-5">
      

        {/* Video */}
        <div className="mt-4">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-md ring-1 ring-slate-900/5 bg-slate-50">
            {/* Decorative glow */}
            <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-gradient-to-br from-sky-400/20 via-teal-400/20 to-indigo-400/20 blur-3xl" />
            <div className="aspect-[16/9] bg-black/90">
              <video
                className="h-full w-full"
                src={videoSrc}
                poster={poster}
                playsInline
                preload="metadata"
                autoPlay={autoPlay}
                loop={loop}
                muted={muted}
                controlsList="nodownload noplaybackrate noremoteplayback nofullscreen"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Video

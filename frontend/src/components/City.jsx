import React from 'react'
import { assets } from '../assets/assets'


const City = () => {

const city=[assets.delhi,assets.mumbai,assets.haldwani,assets.kochi,assets.varanasi,assets.ayodhya,assets.jaipur,assets.goa,assets.muradabad,assets.banglore,assets.ahmdabad,assets.haridwar,assets.aagra,assets.dehradun,assets.patna,assets.jodhpur,assets.lucknow,assets.indore,assets.punjab,assets.chennai]


  return (
    <section className="w-full bg-white">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="text-center mb-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Cities we operate in</h2>
          <p className="text-slate-600 mt-1">Explore the cities where BusTrac is available</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {city.filter(Boolean).map((imgSrc, idx) => (
            <div
              key={idx}
              className="relative overflow-hidden rounded-xl ring-1 ring-slate-900/10 bg-white shadow hover:shadow-md transition-shadow"
            >
              <div className="aspect-[4/3]">
                <img
                  src={imgSrc}
                  alt={`city-${idx + 1}`}
                  className="h-full w-full object-cover transition-transform duration-300 ease-out hover:scale-[1.04]"
                  loading={idx < 10 ? 'eager' : 'lazy'}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default City

import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";

const images = [
  assets.bus
];

export default function Header() {
  const [current, setCurrent] = useState(0);

  // Auto slide every 3s
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className=" bg-white relative w-full h-[30vh] sm:h-[60vh] md:h-[60vh] lg:h-[100vh] mx-auto overflow-hidden shadow-lg">
      {/* Images */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <img
            key={index}
            src={img}
            alt="slider"
            className="w-full h-full mt-5 flex-shrink-0 object-contain object-center"
          />
        ))}
      </div>

      {/* Dots navigation */}
      <div className="absolute bottom-2 sm:bottom-3 w-full flex justify-center gap-1.5 sm:gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full ${
              current === index ? "bg-white" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

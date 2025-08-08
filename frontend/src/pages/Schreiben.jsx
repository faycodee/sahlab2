
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
const Schreiben = () => {
      const heroRef = useRef(null);
    
      useEffect(() => {
        gsap.from(heroRef.current, { opacity: 0, y: -50, duration: 1 });
      }, []);
    return (
           <section
      ref={heroRef}
      className="w-full  h-[86vh] bg-gradient-to-r from-green-50 to-blue-100 py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            German Courses <span className="text-green-700">A1–C2</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
            Learn German with interactive lessons, quizzes, and expert guidance.
            Rapid progress guaranteed thanks to modern teaching methods,
            intensive support, and a recognized level system.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#courses"
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Explore Courses
            </a>
            <a
              href="#about"
              className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-50 transition"
            >
              Learn More
            </a>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <img
            src="/hero-image.jpg"
            alt="Students learning German"
            className="rounded-lg shadow-lg w-full max-w-md object-cover"
          />
        </div>
      </div>
    </section>
    );
};

export default Schreiben;
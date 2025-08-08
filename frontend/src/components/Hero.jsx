import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";

const Hero = () => {
  const heroRef = useRef(null);

  useEffect(() => {
    gsap.from(heroRef.current, { opacity: 0, y: -50, duration: 1 });
  }, []);

  return (
    <section
      ref={heroRef}
      className="w-full   h-[116vh] max-sm:h-[150vh]  bg-gradient-to-r from-green-50 to-blue-100 py-16 md:py-24"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-10 px-4">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          B2 nchalah f  <span className="text-green-700"> Jib !</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-700 mb-6">
           had website tegad bach y3awn lmgharba li baghyin ysoviw rashom, yjibo B2, ymchiw ldeutschland .
           LAghlabiya  kays9to ha9ach endhom mochkil f sprachbausteine + ma7afdinch mzyan lesen  w kaynsawh dghya 
           hadchi elach ymklik hena thefd , traj3 , w tfehm ha9ach had site  fih
           molakhassat lkola text w f sprachbausteine kayfhmk kola haja w elach tdart tema w hören 3ibara ela kodat f 9isas
           .


          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
             href="lesen"
              className="bg-green-600 text-white px-6 py-2 rounded shadow hover:bg-green-700 transition"
            >
              Explore 
            </a>
            {/* <a
              href="#about"
              className="border border-green-600 text-green-600 px-6 py-2 rounded hover:bg-green-50 transition"
            >
              Learn More
            </a> */}
          </div>
        </div>
        <div className=" max-sm:mt-11 max-sm:w-[75vw] md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md flex justify-center items-center">
            {/* 3D Frame */}
            <div
              className="absolute inset-0 rounded-lg"
              style={{
                background: "linear-gradient(135deg, #539A53 0%, #BAD6BA 100%)",
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                transform: "rotateZ(-8deg) scale(1.05)",
                zIndex: 1,
                padding: "16px",
              }}
            ></div>
            {/* Image inside frame */}
            <img
              src="/telc_b2.jpg"
              alt="Students learning German"
              className="  relative rounded-lg shadow-lg w-full object-cover"
              style={{
                zIndex: 2,
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

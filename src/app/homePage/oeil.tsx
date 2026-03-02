import React from 'react';

const ExpertsSection = () => {
  return (
    <div className="container mx-auto relative w-full min-h-screen bg-gradient-to-br from-gray-50 to-white overflow-hidden py-16 px-4">
      
      {/* Prescription Images */}
      {/* Top Left */}
      <div className="absolute top-8 left-8 w-48 h-64 transform -rotate-20 opacity-80 hover:opacity-100 transition-opacity duration-300">
        <img 
          src="/img/paper.png" 
          alt="Prescription médicale 1"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Top Right */}
      <div className="absolute top-12 right-12 w-52 h-68 transform rotate-16 opacity-75 hover:opacity-100 transition-opacity duration-300">
        <img 
          src="/img/paper.png" 
          alt="Prescription médicale 2"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-16 left-16 w-50 h-64 transform rotate-14 opacity-70 hover:opacity-100 transition-opacity duration-300">
        <img 
          src="/img/paper.png" 
          alt="Prescription médicale 3"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-12 right-8 w-48 h-66 transform -rotate-16 opacity-75 hover:opacity-100 transition-opacity duration-300">
        <img 
          src="/img/paper.png" 
          alt="Prescription médicale 4"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Center Bottom */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-44 h-56  opacity-80 hover:opacity-100 transition-opacity duration-300">
        <img 
          src="/img/paper.png" 
          alt="Prescription médicale 5"
          className="w-full h-full object-cover rounded-lg shadow-lg"
          style={{
            filter: 'blur(1px)',
          }}
        />
      </div>

      {/* Main Content - Centered */}
      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20">
        
        {/* Title */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
          L'Œil des Experts
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-700 mb-12 leading-relaxed">
          Des soins validés par l'expertise médicale. Nos médecins vous accompagnent<br/>
          avec leurs conseils et ordonnances pour une routine adaptée et efficace
        </p>

        {/* Quote Section */}
        <div className="relative">
          {/* Opening Quote */}
          <div className="absolute -top-4 -left-8 text-6xl md:text-8xl text-red-500 font-serif leading-none">
            "
          </div>
          
          {/* Quote Text */}
          <blockquote className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed italic px-8 py-4">
            La santé cutanée repose sur l'équilibre du microbiome, véritable
            barrière protectrice. Galby Dermatech utilise une technologie qui le
            renforce et le préserve, permettant ainsi une peau plus résistante,
            apaisée et durablement équilibrée
          </blockquote>
          
          {/* Closing Quote */}
          <div className="absolute -bottom-8 -right-8 text-6xl md:text-8xl text-red-500 font-serif leading-none">
            "
          </div>
        </div>
      </div>

      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-green-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
};

export default ExpertsSection;
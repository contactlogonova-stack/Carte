import React, { useState, useRef, useEffect } from 'react';
import { Download, Loader2 } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface BusinessCardProps {
  isFlipped: boolean;
  onFlip: () => void;
}

const BusinessCard: React.FC<BusinessCardProps> = ({ isFlipped, onFlip }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateXValue = ((y - centerY) / centerY) * -10; // Max tilt 10deg
    const rotateYValue = ((x - centerX) / centerX) * 10;

    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  // Combine flip rotation with tilt rotation
  // If flipped, we add 180 to Y rotation
  const currentRotateY = isFlipped ? rotateY + 180 : rotateY;

  return (
    <div 
      className="card-scene cursor-pointer select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onFlip}
    >
      <div 
        ref={cardRef}
        className="card-object"
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${currentRotateY}deg)`,
          transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)' // Smooth transition for flip
        }}
      >
        {/* FRONT FACE */}
        <div className="card-face card-front flex flex-col items-center justify-center relative border border-white/10">
          <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none"></div>
          
          {/* Logo Container */}
          <div className="relative w-32 h-32 flex items-center justify-center border border-white/20 rounded-sm mb-8 overflow-hidden">
            <img 
              src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
              alt="B&A Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Slogan */}
          <div className="absolute bottom-8 text-center">
            <p className="text-[10px] uppercase tracking-[4px] font-light text-white/80">
              Trust the process
            </p>
          </div>
        </div>

        {/* BACK FACE */}
        <div className="card-face card-back flex flex-col relative border border-white/10 p-8 justify-between">
          <div className="absolute inset-0 bg-grain opacity-20 pointer-events-none"></div>

          {/* Top Left Logo */}
          <div className="w-8 h-8 border border-white/20 flex items-center justify-center overflow-hidden">
             <img 
               src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
               alt="B&A Logo" 
               className="w-full h-full object-cover"
               referrerPolicy="no-referrer"
             />
          </div>

          {/* Center Info */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
            <h2 className="text-2xl font-bold tracking-tight mb-2">Sessou Franck</h2>
            <div className="text-[7px] text-[#AAAAAA] uppercase tracking-wider font-light leading-relaxed">
              <p>Réalisation vidéo • Création de contenu • Mariage</p>
              <p>Direction Artistique • Conseil en image</p>
            </div>
          </div>

          {/* Bottom Section: Contact + QR */}
          <div className="flex items-end justify-between w-full">
            {/* Contact Info */}
            <div className="flex flex-col items-start text-[8px] font-light tracking-wide text-white/80 space-y-0.5">
              <p>+228 96 36 77 05</p>
              <p>bandA.studio@outlook.com</p>
              <p className="opacity-60">Lomé - Togo</p>
            </div>

            {/* QR Code */}
            <div className="w-10 h-10 bg-white p-0.5">
               <img 
                 src="https://i.postimg.cc/LsXFLNZy/code.png" 
                 alt="QR Code" 
                 className="w-full h-full object-cover"
                 referrerPolicy="no-referrer"
               />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;

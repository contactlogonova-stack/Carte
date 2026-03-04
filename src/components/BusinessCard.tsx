import React, { useState, useRef } from 'react';

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
        }}
      >
        {/* FRONT FACE (Dark) */}
        <div className="card-face card-front flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none"></div>
          
          {/* Background Decoration */}
          <div className="absolute -left-10 top-10 opacity-5 pointer-events-none">
             <span className="text-[150px] font-rounded font-bold leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>ba</span>
          </div>
          <div className="absolute -right-10 bottom-10 opacity-5 pointer-events-none rotate-180">
             <span className="text-[150px] font-rounded font-bold leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>ba</span>
          </div>

          {/* Logo Container */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="w-24 h-auto">
               {/* Using the logo from the image URL provided in previous code, assuming it's the right one. 
                   If not, I'll use a text placeholder or the image. 
                   The previous code used https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg 
                   Let's keep using it but maybe apply a filter if it's not transparent.
                   Actually, for the dark card, the logo should be white. 
                   If the image is black on white, I might need to invert it or use a mix-blend-mode.
               */}
               <img 
                 src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                 alt="B&A Logo" 
                 className="w-full h-full object-contain filter invert brightness-0 contrast-200" 
                 referrerPolicy="no-referrer"
               />
            </div>
            
            <p className="text-[10px] uppercase tracking-[0.2em] font-rounded font-bold text-white">
              Trust the process
            </p>
          </div>
        </div>

        {/* BACK FACE (Light) */}
        <div className="card-face card-back flex flex-col relative p-6 justify-between bg-[#F2F0E9] text-[#333333]">
          <div className="absolute inset-0 bg-grain opacity-10 pointer-events-none"></div>

          {/* Top Section */}
          <div className="flex justify-between items-start w-full">
            {/* Name & Title */}
            <div className="flex flex-col">
              <h2 className="text-lg font-rounded font-bold text-[#333333]">Mr Asap Francky</h2>
              <p className="text-[9px] font-bold text-[#333333]/80 uppercase tracking-wide">Réalisateur</p>
            </div>

            {/* Services List */}
            <div className="flex flex-col items-end space-y-1">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-[#333333] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
                </div>
                <span className="text-[7px] font-medium text-[#333333]/80">Production Audiovisuel</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-[#333333] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
                </div>
                <span className="text-[7px] font-medium text-[#333333]/80">Spots publicitaires</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full border border-[#333333] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#333333] rounded-full"></div>
                </div>
                <span className="text-[7px] font-medium text-[#333333]/80">Streetwear</span>
              </div>
            </div>
          </div>

          {/* Center Logo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center opacity-20 scale-150 pointer-events-none">
             <img 
               src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
               alt="B&A Logo" 
               className="w-20 h-auto object-contain mix-blend-multiply"
               referrerPolicy="no-referrer"
             />
          </div>
          
          {/* Real Center Logo (Small) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-2">
             <div className="w-12 h-auto mb-1">
               <img 
                 src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                 alt="B&A Logo" 
                 className="w-full h-full object-contain mix-blend-multiply"
                 referrerPolicy="no-referrer"
               />
             </div>
             <p className="text-[6px] uppercase tracking-[0.2em] font-rounded font-bold text-[#333333]">
              Trust the process
            </p>
          </div>

          {/* Bottom Section */}
          <div className="flex items-end justify-between w-full mt-auto">
            {/* Contact Info */}
            <div className="flex flex-col items-start gap-0.5">
              <p className="text-[8px] font-bold text-[#333333]">+228 96 36 77 05</p>
              <p className="text-[8px] font-medium text-[#333333]/80">bandA.studio@outlook.com</p>
            </div>

            {/* Address */}
            <div className="flex flex-col items-end text-right">
               <p className="text-[7px] font-medium text-[#333333]/70 leading-tight">
                 Lomé, Quartier Attiegou<br/>
                 derrière la cloture de l'aéroport<br/>
                 international de Lomé.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;

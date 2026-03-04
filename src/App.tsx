/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import BusinessCard from './components/BusinessCard';
import { Download, Loader2 } from 'lucide-react';
// @ts-ignore
import html2pdf from 'html2pdf.js';

function App() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Refs for the hidden export container
  const exportContainerRef = useRef<HTMLDivElement>(null);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleExport = async () => {
    if (!exportContainerRef.current) return;
    
    setIsExporting(true);

    try {
      const element = exportContainerRef.current;
      const opt = {
        margin: 0,
        filename: 'BA_BusinessCard.pdf',
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 4, useCORS: true, backgroundColor: '#000000' },
        jsPDF: { unit: 'mm', format: [85, 55] as [number, number], orientation: 'landscape' as const }
      };

      // We need to generate two pages: Front and Back
      // Or one PDF with two pages.
      // html2pdf can handle multiple elements if we structure them right, 
      // but usually it takes one element.
      // We will create a container with both faces visible.
      
      // Actually, standard business card PDF usually has 2 pages or 1 page with both sides?
      // Let's do 2 pages for clarity (Recto, Verso).
      
      // Wait, html2pdf takes an element. If the element is tall, it splits pages.
      // 85mm x 55mm is the page size.
      // So if we stack two 85x55 divs, it should create 2 pages.
      
      await html2pdf().set(opt).from(element).save();
      
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Ambient Light */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Content */}
      <main className="z-10 flex flex-col items-center gap-12">
        <div className="text-center space-y-2">
          <h1 className="text-white text-3xl font-light tracking-[0.2em] uppercase">B & A</h1>
          <p className="text-white/40 text-xs tracking-widest uppercase">Interactive Experience</p>
        </div>

        {/* 3D Card Container */}
        <div className="py-10">
          <BusinessCard isFlipped={isFlipped} onFlip={handleFlip} />
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-white/30 text-[10px] uppercase tracking-widest animate-pulse">
            Click card to flip • Hover to tilt
          </p>
          
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="group relative px-8 py-3 bg-transparent border border-white/20 text-white text-xs uppercase tracking-widest transition-all hover:bg-white hover:text-black disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Download PDF
                </>
              )}
            </span>
          </button>
        </div>
      </main>

      {/* Hidden Container for PDF Generation */}
      {/* We render both faces flat here for the export */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-0">
        <div ref={exportContainerRef}>
          {/* Page 1: Front */}
          <div className="pdf-card page-break flex flex-col items-center justify-center relative pdf-bg-dark overflow-hidden">
             {/* Background Grain */}
             <div className="absolute inset-0 bg-grain opacity-10"></div>
             
             {/* Background Decoration */}
             <div className="absolute -left-10 top-10 opacity-5">
                <span className="text-[150px] font-rounded font-bold leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>ba</span>
             </div>
             <div className="absolute -right-10 bottom-10 opacity-5 rotate-180">
                <span className="text-[150px] font-rounded font-bold leading-none text-transparent" style={{ WebkitTextStroke: '2px white' }}>ba</span>
             </div>
             
             {/* Logo */}
             <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-24 h-auto">
                   <img 
                     src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                     alt="B&A Logo" 
                     className="w-full h-full object-contain filter invert brightness-0 contrast-200"
                     referrerPolicy="no-referrer"
                   />
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em] font-rounded font-bold pdf-text-white">
                  Trust the process
                </p>
             </div>
          </div>

          {/* Page 2: Back */}
          <div className="pdf-card flex flex-col relative p-6 justify-between pdf-bg-light pdf-text-dark">
             <div className="absolute inset-0 bg-grain opacity-10"></div>

             {/* Top Section */}
             <div className="flex justify-between items-start w-full relative z-10">
               {/* Name & Title */}
               <div className="flex flex-col">
                 <h2 className="text-lg font-rounded font-bold pdf-text-dark">Mr Asap Francky</h2>
                 <p className="text-[9px] font-bold pdf-text-dark opacity-80 uppercase tracking-wide">Réalisateur</p>
               </div>

               {/* Services List */}
               <div className="flex flex-col items-end space-y-1">
                 <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full pdf-border-dark flex items-center justify-center">
                     <div className="w-1 h-1 pdf-bg-dark rounded-full"></div>
                   </div>
                   <span className="text-[7px] font-medium pdf-text-dark opacity-80">Production Audiovisuel</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full pdf-border-dark flex items-center justify-center">
                     <div className="w-1 h-1 pdf-bg-dark rounded-full"></div>
                   </div>
                   <span className="text-[7px] font-medium pdf-text-dark opacity-80">Spots publicitaires</span>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-2 h-2 rounded-full pdf-border-dark flex items-center justify-center">
                     <div className="w-1 h-1 pdf-bg-dark rounded-full"></div>
                   </div>
                   <span className="text-[7px] font-medium pdf-text-dark opacity-80">Streetwear</span>
                 </div>
               </div>
             </div>

             {/* Center Logo */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center mt-2 z-0">
                <div className="w-12 h-auto mb-1">
                  <img 
                    src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                    alt="B&A Logo" 
                    className="w-full h-full object-contain mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <p className="text-[6px] uppercase tracking-[0.2em] font-rounded font-bold pdf-text-dark">
                 Trust the process
               </p>
             </div>

             {/* Bottom Section */}
             <div className="flex items-end justify-between w-full mt-auto relative z-10">
                {/* Contact Info */}
                <div className="flex flex-col items-start gap-0.5">
                   <p className="text-[8px] font-bold pdf-text-dark">+228 96 36 77 05</p>
                   <p className="text-[8px] font-medium pdf-text-dark opacity-80">bandA.studio@outlook.com</p>
                </div>

                {/* Address */}
                <div className="flex flex-col items-end text-right">
                   <p className="text-[7px] font-medium pdf-text-dark opacity-70 leading-tight">
                     Lomé, Quartier Attiegou<br/>
                     derrière la cloture de l'aéroport<br/>
                     international de Lomé.
                   </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

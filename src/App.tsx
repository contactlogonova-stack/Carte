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
          <div className="pdf-card page-break flex flex-col items-center justify-center relative border pdf-border-white-10 pdf-bg-black">
             {/* Background Grain */}
             <div className="absolute inset-0 bg-grain opacity-20"></div>
             
             {/* Logo */}
             <div className="relative w-32 h-32 flex items-center justify-center border pdf-border-white-20 rounded-sm mb-8 scale-75 overflow-hidden">
                <img 
                  src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                  alt="B&A Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>

             {/* Slogan */}
             <div className="absolute bottom-8 text-center">
                <p className="text-[10px] uppercase tracking-[4px] font-light pdf-text-white-80">
                  Trust the process
                </p>
             </div>
          </div>

          {/* Page 2: Back */}
          {/* html2pdf will create a new page if the content exceeds the page height */}
          <div className="pdf-card flex flex-col relative border pdf-border-white-10 p-8 justify-between pdf-bg-black">
             <div className="absolute inset-0 bg-grain opacity-20"></div>

             {/* Top Left Logo */}
             <div className="w-8 h-8 border pdf-border-white-20 flex items-center justify-center overflow-hidden">
                <img 
                  src="https://i.postimg.cc/yYR2j607/IMG-20260219-WA0008.jpg" 
                  alt="B&A Logo" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
             </div>

             {/* Center Info */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4">
                <h2 className="text-2xl font-bold tracking-tight mb-2 pdf-text-white">Sessou Franck</h2>
                <div className="text-[7px] pdf-text-gray uppercase tracking-wider font-light leading-relaxed">
                  <p>Réalisation vidéo • Création de contenu • Mariage</p>
                  <p>Direction Artistique • Conseil en image</p>
                </div>
             </div>

             {/* Bottom Section: Contact + QR */}
             <div className="flex items-end justify-between w-full">
                {/* Contact Info */}
                <div className="flex flex-col items-start text-[8px] font-light tracking-wide pdf-text-white-80 space-y-0.5">
                   <p>+228 96 36 77 05</p>
                   <p>bandA.studio@outlook.com</p>
                   <p className="opacity-60">Lomé - Togo</p>
                </div>

                {/* QR Code */}
                <div className="w-10 h-10 bg-white p-0.5">
                   <img 
                     src="./code.png" 
                     alt="QR Code" 
                     className="w-full h-full object-cover"
                   />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

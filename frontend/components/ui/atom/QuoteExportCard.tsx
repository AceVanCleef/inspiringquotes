"use client"
import React, { useRef } from 'react';
import { domToPng } from 'modern-screenshot';
import { Quote } from '@/types/quote';
import { Author } from '@/types/author';
import { Download } from 'lucide-react';

interface Props {
  text: string;
  author: Author;
}

const QuoteExportCard: React.FC<Props> = ({ text, author }) => {
  const quoteRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!quoteRef.current) return;

    try {
      // 1. Bild mit modern-screenshot generieren
      // Scale 2 sorgt für 2x höhere Auflösung (wichtig für scharfen Text!)
      const dataUrl = await domToPng(quoteRef.current, {
        scale: 2,
        backgroundColor: '#0f172a', // slate-900 für den Export festlegen
      });

      // 2. Die native Hilfsfunktion (direkt integriert)
      const link = document.createElement('a');
      link.download = `Quote_${author.last_name}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (err) {
      console.error('Error during PNG-Export:', err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Die Karte, die exportiert wird */}
      <div 
        ref={quoteRef}
        className="w-full max-w-125 aspect-square bg-slate-900 p-12 flex flex-col justify-center items-center text-center shadow-2xl rounded-lg"
      >
        <div className="space-y-6">
          {/* Ein kleines Icon oder Anführungszeichen für den Style */}
          <span className="text-6xl text-slate-700 font-serif leading-none">“</span>
          
          <p className="text-2xl md:text-3xl font-serif text-slate-100 leading-tight italic">
            {text}
          </p>
          
          <div className="pt-4">
            <p className="text-lg font-bold text-slate-400 uppercase tracking-widest">
              — {author.first_name} {author.last_name}
            </p>
            <p className="text-xs text-slate-500 mt-4 tracking-tighter">
              inspiringquotes.ch
            </p>
          </div>
        </div>
      </div>

      {/* Der Download-Button (wird nicht mit exportiert, da er außerhalb von quoteRef liegt) */}
      <button
      onClick={handleDownload}
      className="
        group 
        flex items-center gap-3 
        px-6 py-3 
        bg-white border border-slate-200 
        rounded-full 
        text-slate-600 font-medium 
        transition-all duration-300 ease-out
        cursor-pointer
        hover:bg-slate-50 hover:border-slate-300 hover:shadow-md
        active:scale-95
      "
    >
      <Download 
        className="
          w-5 h-5 
          text-slate-400 
          transition-colors duration-300
          group-hover:text-rose-500 
          group-hover:translate-y-px
        " 
      />
      <span className="group-hover:text-slate-900 transition-colors">
        Download as Image
      </span>
    </button>
    </div>
  );
};

export default QuoteExportCard;
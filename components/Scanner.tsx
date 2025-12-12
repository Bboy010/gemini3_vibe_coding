import React from 'react';
import { ScanStatus } from '../types';

interface ScannerProps {
  imageSrc: string;
  status: ScanStatus;
}

const Scanner: React.FC<ScannerProps> = ({ imageSrc, status }) => {
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-slate-900 shadow-lg border border-slate-200 aspect-video">
      {imageSrc ? (
        <>
          <img 
            src={imageSrc} 
            alt="Uploaded donation" 
            className="w-full h-full object-contain opacity-90"
          />
          {status === 'scanning' && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="scanner-line absolute w-full h-1 bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)] z-10"></div>
              <div className="absolute inset-0 bg-emerald-500/10 mix-blend-overlay"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-slate-500 bg-slate-100">
          <p>No image selected</p>
        </div>
      )}
    </div>
  );
};

export default Scanner;
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, AlertCircle, CheckCircle2, Heart } from 'lucide-react';
import Scanner from './components/Scanner';
import InventoryTable from './components/InventoryTable';
import { InventoryItem, ScanStatus } from './types';
import { analyzePantryImage } from './services/geminiService';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size too large. Please upload an image under 5MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setItems([]);
        setStatus('idle');
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleScan = async () => {
    if (!image) return;

    setStatus('scanning');
    setError(null);

    try {
      const results = await analyzePantryImage(image);
      setItems(results);
      setStatus('complete');
    } catch (err: any) {
      setStatus('error');
      setError(err.message || "Failed to analyze image. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-100 p-2 rounded-lg">
              <Heart className="w-6 h-6 text-emerald-600" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">Community Pantry Scanner</h1>
              <p className="text-xs text-slate-500 font-medium">Digital Inventory Assistant</p>
            </div>
          </div>
          <div className="hidden sm:block text-xs text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
            Powered by Gemini 3.0 Pro
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Intro Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-lg font-semibold text-slate-800">Digitize Your Donations</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Upload a photo of food items to automatically extract product details, quantities, and expiration dates.
            </p>
          </div>

          {/* Upload Area */}
          <div className="space-y-6">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />
            
            {!image ? (
              <button 
                onClick={triggerFileInput}
                className="w-full h-64 border-2 border-dashed border-emerald-200 rounded-xl bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-400 transition-all flex flex-col items-center justify-center gap-4 group cursor-pointer"
              >
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  <Upload className="w-8 h-8 text-emerald-500" />
                </div>
                <div className="text-center">
                  <p className="text-emerald-900 font-medium">Click to upload photo</p>
                  <p className="text-emerald-600/70 text-xs mt-1">Supports JPG, PNG (Max 5MB)</p>
                </div>
              </button>
            ) : (
              <div className="space-y-6">
                 {/* Scanner View */}
                <Scanner imageSrc={image} status={status} />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                   <button 
                    onClick={triggerFileInput}
                    className="px-6 py-3 rounded-lg text-slate-600 font-medium hover:bg-slate-100 border border-transparent transition-colors text-sm"
                    disabled={status === 'scanning'}
                  >
                    Replace Photo
                  </button>

                  <button
                    onClick={handleScan}
                    disabled={status === 'scanning' || status === 'complete'}
                    className={`
                      relative overflow-hidden px-8 py-3 rounded-lg font-semibold text-white shadow-md
                      transition-all duration-200 flex items-center justify-center gap-2
                      ${status === 'scanning' ? 'bg-slate-400 cursor-not-allowed' : 
                        status === 'complete' ? 'bg-emerald-600 cursor-default' :
                        'bg-emerald-600 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0'}
                    `}
                  >
                    {status === 'scanning' ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Scanning Supplies...
                      </>
                    ) : status === 'complete' ? (
                      <>
                        <CheckCircle2 className="w-5 h-5" />
                        Scan Complete
                      </>
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        Start Scanner Mode
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 mb-6 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-red-900 text-sm">Scan Failed</h4>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Results */}
        {status === 'complete' && items.length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <InventoryTable items={items} />
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="text-center py-6 text-slate-400 text-xs">
        <p>&copy; 2024 Community Pantry Initiative. Built for social good.</p>
      </footer>
    </div>
  );
};

export default App;